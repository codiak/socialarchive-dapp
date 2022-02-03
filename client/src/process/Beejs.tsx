import { Bee, Reference, Utils, FeedWriter, FeedReader, SOCWriter, SOCReader } from "@ethersphere/bee-js";
import { Bytes } from "@ethersphere/bee-js/dist/src/utils/bytes";
import axios from "axios";
import LZString from "lz-string";
import { buildAxiosFetch } from "@lifeomic/axios-fetch";
import { Buffer } from "buffer";
import { convertFeedIndexToInt, getJsonSize, convertBytesToString } from "../utils";

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
    let username = data.account?.username;
    let name = data.account?.accountDisplayName;
    let isVerified = data.verified?.verified;
    let bio = data.profile.description.bio;
    let bundle = JSON.stringify(data);
    let result = undefined;

    try {
      console.log("Uploading to Swarm: ", this.bee.url);

      const fetch = this.trackRequest(progressCb, true);
      //1. upload bundle and get hash

      // @ts-ignore
      let { reference } = await this.bee.uploadFile(this.POSTAGE_STAMP, bundle, username, { fetch });
      result = reference;
      await this.addProfileToFeed(reference, username, name, bio, isVerified);
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

  async addProfileToFeed(hash: Reference, username: string, name: string, bio: string, isVerified: boolean) {
    // build feed entry
    const payload = {
      timestamp: new Date().getTime(),
      profile: {
        hash,
        username,
        name,
        bio,
        isVerified,
      },
      // profileImage,
    };

    // 2. Upload feed with hash and get feed index
    await this.feedWriter.upload(this.POSTAGE_STAMP, hash);
    let feedIndex = await this.getFeedIndex(hash);
    console.log("feedIndex", feedIndex);

    // 3. Convert feedIndex to int
    let feedIndexInt = convertFeedIndexToInt(feedIndex);
    console.log("feedIndex converted: ", feedIndexInt);

    // 4. Upload profile by adding feedIndex to topic
    let message = JSON.stringify(payload);
    console.log("payload and size: ", payload, getJsonSize(payload));

    let compress = LZString.compressToUint8Array(message);
    console.log("compressed payload size: ", convertBytesToString(compress.length));
    let socResult = await this.writeSOC(feedIndexInt, compress);
    console.log("saved payload in feed", socResult);

    // 5. Download last profile (check the last entry we uploaded)
    // let socReaderResult = await this.readSOC(feedIndexInt);
    // let uncompress = LZString.decompressFromUint8Array(socReaderResult.payload()) as string;
    // console.log("Uncompressed and parsed message: ", JSON.parse(uncompress));

    // 6. Download last 5 profiles
    let feeds = await this.getFeeds(feedIndexInt, 5);
    console.log("last 5 feed messages: ", feeds);
  }

  async writeSOC(index: number, data: any) {
    const topic = Buffer.alloc(32);
    topic.writeUInt16LE(index, 0);

    type Identifier = Bytes<32>;
    const topicBytes: Identifier = Utils.hexToBytes(topic.toString("hex"));

    return await this.socWriter.upload(this.POSTAGE_STAMP, topicBytes, data);
  }

  async readSOC(index: number) {
    const topic = Buffer.alloc(32);
    topic.writeUInt16LE(index, 0);

    type Identifier = Bytes<32>;
    const topicBytes: Identifier = Utils.hexToBytes(topic.toString("hex"));

    return await this.socReader.download(topicBytes);
  }

  async getFeedIndex(hash: Reference) {
    try {
      const result = await this.feedReader.download();
      let { feedIndex, reference } = result;
      if (reference === hash) {
        return feedIndex;
      }
      throw "Archive hash does not match feed hash.";
    } catch (error: any) {
      throw error;
    }
  }

  async getFeeds(feedIndex: number, maxPreviousUpdates: number) {
    console.log("Getting feeds...");
    let feeds = [];
    for (let index = feedIndex; index > 0 && feedIndex - (index - 1) <= maxPreviousUpdates; index--) {
      console.log("index:", index);
      let socReaderResult = await this.readSOC(index);
      let uncompress = LZString.decompressFromUint8Array(socReaderResult.payload()) as string;
      let parsedMessage = JSON.parse(uncompress);
      console.log("parsed message:", parsedMessage);
      feeds.push(parsedMessage);
    }
    return feeds;
  }
}
