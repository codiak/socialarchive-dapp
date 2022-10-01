import {
  Bee,
  Reference,
  Utils,
  FeedWriter,
  FeedReader,
  SOCWriter,
  SOCReader,
} from "@ethersphere/bee-js";
import { Bytes } from "@ethersphere/bee-js/dist/types/utils/bytes";
import axios from "axios";
import LZString from "lz-string";
import { buildAxiosFetch } from "@lifeomic/axios-fetch";
import { Buffer } from "buffer";
import {
  convertFeedIndexToInt,
  getJsonSize,
  convertBytesToString,
  convertImageToAscii,
  createImageFromAscii,
  saveToIdb,
  wipeIdb,
} from "../utils";

import * as authModule from '../components/auth/authModule.js';

declare type Identifier = Bytes<32>;

export class Beejs {
  private bee: Bee;
  private feedWriter: FeedWriter;
  private feedReader: FeedReader;
  private socWriter: SOCWriter;
  private socReader: SOCReader;
  private SA_PRIVATEKEY = process.env.REACT_APP_SA_PRIVATEKEY as string;
  private SA_ETHADDRESS = process.env.REACT_APP_SA_ETHADDRESS as string;
  private POSTAGE_STAMP =
    "0000000000000000000000000000000000000000000000000000000000000000" as Reference;
  private SOC_READ_TIMEOUT: number = 20000;

  private BEE_HOSTS = [
    "https://gateway-proxy-bee-1-0.gateway.ethswarm.org",
    "https://gateway-proxy-bee-2-0.gateway.ethswarm.org",
    "https://gateway-proxy-bee-3-0.gateway.ethswarm.org",
    "https://gateway-proxy-bee-4-0.gateway.ethswarm.org",
    "https://gateway-proxy-bee-5-0.gateway.ethswarm.org",
    "https://gateway-proxy-bee-6-0.gateway.ethswarm.org",
    "https://gateway-proxy-bee-7-0.gateway.ethswarm.org",
    "https://gateway-proxy-bee-8-0.gateway.ethswarm.org",
    "https://gateway-proxy-bee-9-0.gateway.ethswarm.org",
    // "https://bee-10.gateway.ethswarm.org", // this one has cors policy enabled
  ];

  constructor() {
    const randomIndex = Math.floor(Math.random() * this.BEE_HOSTS.length);
    this.bee = new Bee(this.BEE_HOSTS[randomIndex]);
    const topic = this.bee.makeFeedTopic("archived-bundles");
    this.feedWriter = this.bee.makeFeedWriter("sequence", topic, this.SA_PRIVATEKEY);
    this.feedReader = this.bee.makeFeedReader("sequence", topic, this.SA_ETHADDRESS);
    this.socWriter = this.bee.makeSOCWriter(this.SA_PRIVATEKEY);
    this.socReader = this.bee.makeSOCReader(this.SA_ETHADDRESS, {
      timeout: this.SOC_READ_TIMEOUT,
    });
  }

  /**
   *
   * @param reference String hash of Swarm resource
   *
   * @param progressCb function that will track the dpload
   *
   * @return JSON archive
   */
  async download(reference: any, progressCb: any) {
    let result = undefined;
    const fetch = this.trackRequest(progressCb, false);

    console.log("Downloading from Swarm: ", this.bee.url);
    console.log(reference);

    try {
      // @ts-ignore
      let bundle = await this.bee.downloadFile(reference, undefined, { fetch });
      console.log("bundle data:", bundle.data);
      result = bundle.data.json();
      console.log("result after downloading archive:",result);

    } catch (e) {
      console.log("error downloading", e);
      result = e;
    }

    return result;
  }

  /**
   * Upload JSON archive to Swarm, add Swarm hash to archive-bundle feed topic and add profile to Single Owner Chunk
   *
   * @param data JSON archive that contains archive items and media
   *
   * @param progressCb Functions that will track the upload
   *
   * @return {Promise<Reference>} Swarm hash of the uploaded archive
   *
   */
  async upload(data: any, progressCb: any, privateUpload: boolean) {
    let { archiveItems, archiveSize } = data;
    if (archiveItems === undefined) {
      throw new Error("Archive items are undefined, aborting upload");
    }
    // bundle that gets uploaded to swarm
    let bundle = JSON.stringify(data);

    // create profile to add to SOC
    let username = archiveItems.account?.username;
    let name = archiveItems.account?.accountDisplayName;
    let isVerified = archiveItems.verified?.verified;
    let bio = archiveItems.profile.description.bio;
    const avatarBlob = archiveItems.profile.avatarMediaUrl;
    // convert profile image to ascii
    let asciiProfile = (await convertImageToAscii(avatarBlob)) as [];

    if(privateUpload) {
      bundle = await authModule.encrypt(bundle);
      bundle = JSON.stringify({cipher: bundle});
      username = await authModule.encrypt(archiveItems.account?.username);
    }

    let result = undefined;

    try {
      console.log("Uploading to Swarm: ", this.bee.url);
      const fetch = this.trackRequest(progressCb, true);
      // 1. upload bundle to Swarm and get hash
      let { reference } = await this.bee.uploadFile(this.POSTAGE_STAMP, bundle, username, {
        // @ts-ignore
        fetch,
      });
      result = reference;
      console.log("Got Swarm hash: ", reference);
      // 2. upload hash to feed
      await this.saveSwarmHashInFeed(reference);
      // 3. download latest feed and get feed index
      let feedIndex = (await this.getFeedIndex(reference)) as number;
      if(!privateUpload) {
        // 4. upload profile, hash and feed index to Single Owner Chunk
        await this.saveProfileInSOC(
          reference,
          archiveSize,
          username,
          name,
          bio,
          isVerified,
          asciiProfile,
          feedIndex
        );
      }
    } catch (err: any) {
      console.log("Error uploading", err);
      const { status, message } = err;
      const massagedMessage =
        status === 413 ? "max file size exceeded." : `${message} \n\nPlease try again.`;
      err.message = `Error during upload: ${massagedMessage}`;
      result = err;
    }
    return result;
  }

  /**
   *
   * @param progressCb callback function to track progress
   *
   * @param upload boolean true if upload, false if download
   *
   * @return AxiosFetch function that tracks progress
   */
  trackRequest(progressCb: any, upload: boolean) {
    const axiosConfig = upload
      ? { onUploadProgress: progressCb }
      : { onDownloadProgress: progressCb };
    return buildAxiosFetch(axios.create(axiosConfig));
  }

  /**
   * Write Swarm hash to archive-bundle feed topic
   *
   * @param hash Reference to the uploaded bundle in Swarm
   *
   * @return number representing the feed index of the uploaded bundle
   **/
  async saveSwarmHashInFeed(hash: Reference) {
    console.log("Uploading hash to feed");
    try {
      await this.feedWriter.upload(this.POSTAGE_STAMP, hash);
      // console.log("Succsessfully uploaded hash to feed: ");
    } catch (error) {
      console.log("Error adding hash to feed", error);
      throw error;
    }
  }

  /**
   * Save bundle owner's profile to Single Owner Chunk
   *
   * @param hash Reference Swarm hash of the uploaded bundle
   *
   * @param username string username of the bundle owner
   *
   * @param name string account display name
   *
   * @param bio string account bio
   *
   * @param isVerified boolean account verification status
   *
   * @param asciiProfile ascii line array of the profile image
   *
   * @pararm feedIndex Number representing the feed index of the uploaded bundle
   *
   **/
  async saveProfileInSOC(
    hash: Reference,
    archiveSize: string,
    username: string,
    name: string,
    bio: string,
    isVerified: boolean,
    asciiProfile: [],
    feedIndex: number
  ) {
    const payload = {
      timestamp: new Date().getTime(),
      archiveSize,
      username,
      accountDisplayName: name,
      isVerified,
      description: {
        bio,
      },
      avatarMediaUrl: asciiProfile,
      swarmHash: hash,
    };
    let message = JSON.stringify(payload);
    console.log("feed payload and size: ", payload, getJsonSize(payload));
    let compressedProfile = LZString.compressToUint8Array(message) as Uint8Array;
    console.log("compressed feed payload size: ", convertBytesToString(compressedProfile.length));

    // create an identifier for SOC using feed index
    let socId = await this.createSOCIdentifer(feedIndex);

    // upload profile to SOC
    let socResult = await this.writeSOC(socId, compressedProfile);
    console.log("saved payload in feed", socResult);
  }

  /**
   * Write Single Owner Chunk to Swarm
   *
   * @param identifier Identifier
   *
   * @param data JSON data to be saved
   *
   * @returns Reference to the saved Single Owner Chunk
   */
  async writeSOC(identifier: Identifier, data: any) {
    try {
      return await this.socWriter.upload(this.POSTAGE_STAMP, identifier, data);
    } catch (error) {
      console.log("Error writing to SOC: ", error);
      throw error;
    }
  }

  /**
   * Reads Single Owner Chunk from Swarm
   *
   * @param index feed index Number
   *
   * @returns SingleOwnerChunk - data stored in SOC
   */
  async readSOC(index: number) {
    try {
      // convert index to identifier
      let identifier = await this.createSOCIdentifer(index);
      return await this.socReader.download(identifier);
    } catch (error) {
      console.log("Error reading from SOC: ", error);
      throw error;
    }
  }

  /**
   * Creates an Identifier from feed index to be used in SOC
   *
   * @param index Number of feed index
   *
   * @returns Bytes<32> Identifier
   */
  async createSOCIdentifer(index: number) {
    const id = Buffer.alloc(32);
    id.writeUInt16LE(index, 0);
    const idBytes: Identifier = Utils.hexToBytes(id.toString("hex"));
    return idBytes;
  }

  /**
   *
   * @param hash (optional) Reference to the uploaded bundle in Swarm
   *
   * @returns number representing the feed index of the uploaded bundle
   */
  async getFeedIndex(hash: Reference) {
    try {
      console.log("Downloading latest feed");
      const result = await this.feedReader.download();
      console.log("feed: ", result);
      let { feedIndex } = result; // reference
      // convert feedIndex to a number
      let feedIndexAsInt = convertFeedIndexToInt(feedIndex);
      console.log("latest index: ", feedIndexAsInt);
      // if (hash !== null && hash !== undefined) {
      //   if (reference === hash) {
      //     return feedIndexAsInt;
      //   }
      //   // eslint-disable-next-line no-throw-literal
      //   throw new Error("Archive hash does not match feed hash.");
      if (feedIndex !== null && feedIndex !== undefined) {
        return feedIndexAsInt;
      }
    } catch (error: any) {
      console.log("Error getting feed index: ", error);
      // const { status, message } = error;
      // const massagedMessage = status === 404 ? "No archives found" : `${message} \n\nPlease try again.`;
      // error.message = `Error getting archives: ${massagedMessage}`;
      throw error;
    }
  }

  /**
   * Get last n feed items from feedIndex
   *
   * @param feedIndex Number of starting feed index
   *
   * @param maxPreviousUpdates Number previous feed items to return
   *
   **/
  async getFeeds(feedIndex: number, maxPreviousUpdates: number, dispatch: any, cachedFeeds: any) {
    console.log("cached feeds: ", cachedFeeds);
    console.log("Get last", maxPreviousUpdates, "feeds");
    let feeds = [];
    return new Promise(async (resolve, reject) => {
      try {
        // handle edge case when feedIndex is 0
        for (
          let index = feedIndex;
          index >= 0 && feedIndex - (index - 1) <= maxPreviousUpdates;
          index--
        ) {
          let socIndex = index - 1;
          console.log("index:", index);
          console.log("socindex: ", socIndex);
          if (socIndex !== -1) {
            let socReaderResult = await this.readSOC(socIndex);
            let uncompress = LZString.decompressFromUint8Array(socReaderResult.payload()) as string;
            let parsedMessage = JSON.parse(uncompress);
            if (parsedMessage.avatarMediaUrl) {
              // rewrites the avatarMediaUrl as a data uri
              parsedMessage.avatarMediaUrl = createImageFromAscii(parsedMessage.avatarMediaUrl);
            }
            feeds.push(parsedMessage);
            dispatch({
              type: "FEED_ITEM_LOADED",
              payload: parsedMessage,
              delta: cachedFeeds && cachedFeeds.length > 0 ? true : false,
            });
          }
        }
        // deletes Idb
        await wipeIdb();
        await saveToIdb(
          "feeds" + feedIndex,
          cachedFeeds ? cachedFeeds.concat(feeds.reverse()) : feeds.reverse()
        );
        resolve(feeds);
      } catch (error) {
        console.log("Error downloading feeds", error);
        reject(error);
      }
    });
  }
}
