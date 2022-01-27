import { Bee, Reference } from "@ethersphere/bee-js";
import axios from "axios";
// import { buildAxiosFetch } from "../utils/axiosFetch";

import { buildAxiosFetch } from "@lifeomic/axios-fetch";

export class Beejs {
  private bee: Bee;
  private POSTAGE_STAMP = "0000000000000000000000000000000000000000000000000000000000000000" as Reference;

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
    "https://bee-10.gateway.ethswarm.org",
  ];

  constructor() {
    const randomIndex = Math.floor(Math.random() * this.BEE_HOSTS.length);
    const randomBee = new Bee(this.BEE_HOSTS[randomIndex]);
    this.bee = randomBee;
  }

  async download(reference: any, progressCb: any) {
    let result = undefined;
    const axiosInstance = axios.create({
      onDownloadProgress: progressCb,
    });
    const fetch = buildAxiosFetch(axiosInstance);
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
    let bundleOwner = data.account?.username;
    let bundle = JSON.stringify(data);
    let result = undefined;
    // TODO hack to get progress on upload, fix later
    const axiosInstance = axios.create({
      onUploadProgress: progressCb,
    });
    const fetch = buildAxiosFetch(axiosInstance);
    try {
      console.log("Uploading to Swarm: ", this.bee.url);
      // @ts-ignore
      let { reference } = await this.bee.uploadFile(this.POSTAGE_STAMP, bundle, bundleOwner, { fetch });
      result = reference;
    } catch (err) {
      console.log("Error uploading", err);
      const { status, message } = err;
      const massagedMessage = status === 413 ? 'max file size exceeded.' : `${message} \n\nPlease try again.`;
      err.message = `Error during upload: ${massagedMessage}`;
      result = err;
    }
    return result;
  }
}
