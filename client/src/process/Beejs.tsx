import { Bee, Reference, Utils, FeedWriter, FeedReader, SOCWriter, SOCReader } from "@ethersphere/bee-js";
import { Bytes } from "@ethersphere/bee-js/dist/src/utils/bytes";
import axios from "axios";
import LZString from "lz-string";
import { buildAxiosFetch } from "@lifeomic/axios-fetch";
import { Buffer } from "buffer";
import { convertFeedIndexToInt, getJsonSize, convertBytesToString, convertImageToAscii, createImageFromAscii } from "../utils";

export class Beejs {
  private bee: Bee;
  private feedWriter: FeedWriter;
  private feedReader: FeedReader;
  private socWriter: SOCWriter;
  private socReader: SOCReader;
  private SA_PRIVATEKEY = process.env.REACT_APP_SA_PRIVATEKEY as string;
  private SA_ETHADDRESS = process.env.REACT_APP_SA_ETHADDRESS as string;
  private POSTAGE_STAMP = "0000000000000000000000000000000000000000000000000000000000000000" as Reference;
  private SOC_READ_TIMEOUT: number = 3000;

  private BEE_HOSTS = [
    "https://bee-1.gateway.ethswarm.org",
    "https://bee-2.gateway.ethswarm.org",
    "https://bee-3.gateway.ethswarm.org",
    "https://bee-4.gateway.ethswarm.org",
    "https://bee-5.gateway.ethswarm.org",
    "https://bee-6.gateway.ethswarm.org",
    "https://bee-7.gateway.ethswarm.org",
    "https://bee-8.gateway.ethswarm.org",
    "https://bee-9.gateway.ethswarm.org",
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

  async download(reference: any, progressCb: any) {
    let result = undefined;
    const fetch = this.trackRequest(progressCb, false);

    console.log("Downloading from Swarm: ", this.bee.url);
    console.log(reference);

    try {
      // @ts-ignore
      let bundle = await this.bee.downloadFile(reference, undefined, { fetch });
      result = bundle.data.json();
    } catch (e) {
      console.log("error downloading", e);
      result = e;
    }
    return result;
  }

  async upload(data: any, progressCb: any) {
    let { archiveItems, mediaMap } = data;
    // bundle that gets uploaded to swarm
    let bundle = JSON.stringify(data);
    let username = archiveItems.account?.username;
    let name = archiveItems.account?.accountDisplayName;
    let isVerified = archiveItems.verified?.verified;
    let bio = archiveItems.profile.description.bio;
    const { avatarMediaUrl } = archiveItems.profile;
    let profileMediaId = avatarMediaUrl.substring(avatarMediaUrl.lastIndexOf("/") + 1, avatarMediaUrl.length);
    let profileMediaUri = mediaMap[profileMediaId];
    let asciiProfile = (await convertImageToAscii(profileMediaUri)) as Uint8Array;

    let result = undefined;

    try {
      console.log("Uploading to Swarm: ", this.bee.url);
      const fetch = this.trackRequest(progressCb, true);
      //1. upload bundle and get hash
      // @ts-ignore
      let { reference } = await this.bee.uploadFile(this.POSTAGE_STAMP, bundle, username, { fetch });
      result = reference;
      await this.addProfileToFeed(reference, username, name, bio, isVerified, asciiProfile);
    } catch (err: any) {
      console.log("Error uploading", err);
      const { status, message } = err;
      const massagedMessage = status === 413 ? "max file size exceeded." : `${message} \n\nPlease try again.`;
      err.message = `Error during upload: ${massagedMessage}`;
      result = err;
    }
    return result;
  }

  trackRequest(progressCb: any, upload: boolean) {
    const axiosInstance = upload ? axios.create({ onUploadProgress: progressCb }) : axios.create({ onDownloadProgress: progressCb });
    return buildAxiosFetch(axiosInstance);
  }

  async addProfileToFeed(hash: Reference, username: string, name: string, bio: string, isVerified: boolean, asciiProfile: Uint8Array) {
    // build feed entry
    const payload = {
      timestamp: new Date().getTime(),
      username,
      accountDisplayName: name,
      description: {
        bio,
      },
      avatarMediaUrl: asciiProfile,
      swarmHash: hash,
    };

    // 2. Upload feed with hash and get feed index
    await this.feedWriter.upload(this.POSTAGE_STAMP, hash);
    let feedIndex = (await this.getFeedIndex(hash)) as number;

    // 3. Upload profile by adding feedIndex to topic
    let message = JSON.stringify(payload);
    console.log("feed payload and size: ", payload, getJsonSize(payload));

    let compress = LZString.compressToUint8Array(message);
    console.log("compressed feed payload size: ", convertBytesToString(compress.length));
    let socResult = await this.writeSOC(feedIndex, compress);
    console.log("saved payload in feed", socResult);

    // // 4. Download the last 5 profiles
    // let feeds = await this.getFeeds(feedIndex, 5);
    // console.log("last 5 feed messages: ", feeds);
  }

  async writeSOC(index: number, data: any) {
    try {
      let topicBytes = await this.createTopic(index);
      return await this.socWriter.upload(this.POSTAGE_STAMP, topicBytes, data);
    } catch (error) {
      throw error;
    }
  }

  async readSOC(index: number) {
    try {
      let topicBytes = await this.createTopic(index);
      return await this.socReader.download(topicBytes);
    } catch (error) {
      throw error;
    }
  }

  async createTopic(index: number) {
    const topic = Buffer.alloc(32);
    topic.writeUInt16LE(index, 0);

    type Identifier = Bytes<32>;
    const topicBytes: Identifier = Utils.hexToBytes(topic.toString("hex"));
    return topicBytes;
  }

  async getFeedIndex(hash: Reference) {
    try {
      console.log("Getting latest feed index");
      const result = await this.feedReader.download();
      // console.log("result", result);
      let { feedIndex, reference } = result;
      let feedIndexAsInt = convertFeedIndexToInt(feedIndex);
      console.log("latest index: ", feedIndexAsInt);
      if (hash !== null && hash !== undefined) {
        if (reference === hash) {
          return feedIndexAsInt;
        }
        throw "Archive hash does not match feed hash.";
      } else if (feedIndex !== null && feedIndex !== undefined) {
        return feedIndexAsInt;
      }
    } catch (error: any) {
      throw error;
    }
  }

  async getFeeds(feedIndex: number, maxPreviousUpdates: number) {
    console.log("Getting last", maxPreviousUpdates, "feeds...");
    let feeds = [];
    try {
      for (let index = feedIndex; index > 0 && feedIndex - (index - 1) <= maxPreviousUpdates; index--) {
        console.log("index:", index);
        let socReaderResult = await this.readSOC(index);
        let uncompress = LZString.decompressFromUint8Array(socReaderResult.payload()) as string;
        let parsedMessage = JSON.parse(uncompress);
        if (parsedMessage.avatarMediaUrl) {
          parsedMessage.avatarMediaUrl = createImageFromAscii(parsedMessage.avatarMediaUrl);
        }
        feeds.push(parsedMessage);
      }
    } catch (error) {
      console.log("error downloading feeds", error);
      // @ts-ignore
      feeds = error;
    }
    return feeds;
  }
}
