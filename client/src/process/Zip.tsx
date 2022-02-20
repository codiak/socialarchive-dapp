import JSZip from "jszip";
import { convertBytesToString } from "../utils";
let i = 0;
let t = 0;
export class Zip {
  file: any;
  archiveItems: any = {};
  media: any = {};
  archiveSize: any;

  constructor(file: any) {
    this.file = file;
  }

  static async unzip(file: any) {
    const zip = new Zip(file);
    await zip.internalUnzip();
    const { archiveItems, archiveSize, media: mediaMap } = zip;
    return { archiveSize, archiveItems, mediaMap };
  }

  async extractFile(file: any) {
    let extractedFile = undefined;

    // all js files are json :)
    if (file.name.endsWith(".js")) {
      // console.log("Extracting json file: ", file.name);
      try {
        extractedFile = await this.extractJson(file);
      } catch (e) {
        // console.log("file name: ", file.name);
        // console.log("Skip: no data: ", file.name, e);
      }
    } else if (
      file.name.endsWith(".mp4") ||
      file.name.endsWith(".jpg") ||
      file.name.endsWith(".mp3") ||
      file.name.endsWith(".png")
    ) {
      try {
        extractedFile = await this.extractMedia(
          file,
          file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length)
        );
      } catch (e) {
        // console.log("Skip: no media data: ", file.name, e);
      }
    } else {
      // console.log("Skip: ", file);
    }
    return extractedFile;
  }

  // clean up and rearrange for our consumption
  formatData(json: any, filename: any) {
    try {
      if (json.length === undefined) {
        let propName = filename.substring(0, filename.indexOf("."));
        return { [propName]: json };
      }
      let name = Object.keys(json[0])[0];
      // console.log("format: name: ", name);
      if (
        ["tweet.js", "like.js", "following.js", "follower.js", "mute.js", "block.js"].includes(
          filename
        )
      ) {
        json = { [name]: json.map((t: any) => t[name]) };
      } else {
        if (json.length > 1) {
          let plural = name + "s";
          // TODO this is a ugly hack, need to compare the various ad data files and merge them somehow using the timestamps
          if (name.toString() === "ad") {
            plural += i === 0 ? "" : i;
            i++;
          }
          json = { [plural]: json };
        } else {
          json = json[0] !== undefined ? json[0] : json;
        }
      }
      return json;
    } catch (e) {
      // eslint-disable-next-line no-throw-literal
      throw "Error formatting json: " + e + json;
    }
  }

  extractJson(file: any) {
    return new Promise<any>((resolve, reject) => {
      file.async("string").then((content: string) => {
        let fname = file.name.replace("data/", ""); // strip out folder name
        let json = {} as any;
        try {
          // remove var
          let c = content.substring(content.indexOf("=") + 1, content.length).trim();
          // don't need to parse or resolve if substring contains only 3 characters -> empty array;
          if (c.length > 3) {
            json = this.formatData(JSON.parse(c), fname);
            console.log("Add: ", json);
            t++;
            resolve(json);
          } else {
            reject(json);
          }
        } catch (e) {
          console.log("Error parsing json : ", e);
          reject(json);
        }
      });
    });
  }

  extractMedia(file: any, type: string) {
    return new Promise<any>((resolve, reject) => {
      const name = file.name
        .replace("data/", "")
        .substring(file.name.lastIndexOf("/") + 1, file.name.length); // strip out folder names
      const id = name.includes("-") ? name.substring(name.lastIndexOf("-") + 1, name.length) : "";
      // TODO: handle ALL media types
      const video = type === "mp4" ? "video/mp4" : null;
      const audio = type === "mp3" ? "audio/mp3" : null;
      const image = type !== "mp4" && type !== "mp3" ? "image/" + type : null;
      const dataUrlProlog =
        "data:" +
        (video !== null ? video : image !== null ? image : audio !== null ? audio : null) +
        ";base64,";
      const processedFile = {
        name,
        id,
        category: "media",
        type,
        data: "",
      };
      file.async("base64").then((content: any) => {
        processedFile.data = dataUrlProlog + content;
        console.log("Add media: ", processedFile);
        resolve(processedFile);
      });
    });
  }

  async extract(zip: JSZip) {
    // let unZippedFiles: { name: string; type: string; data: {} }[] = [];
    let unZippedFiles = {} as any;
    console.log("Building archive");

    /* typcial twitter backup zip file structure
    twitter_backup.zip
      + assets          <-- folder contains artifacts used by twitter html page, skip
      + data            <-- folder we are interested in
      Your archive.html <-- skip this file
    */
    // iterate over media contents and add to unzippedFiles array
    for (var key in zip.files) {
      let file = zip.files[key];

      // if entry is a directory skip it (for now)
      if (!file.dir) {
        // process files that are under the data folder
        if (key.includes("data")) {
          let extractedFile = await this.extractFile(file);
          if (extractedFile !== undefined) {
            const { id, category } = extractedFile;

            if (category === "media") {
              this.media[id] = extractedFile.data;
            } else {
              unZippedFiles = { ...unZippedFiles, ...extractedFile };
            }
          }
        }
      } else {
        // console.log("Skip: Entry === directory name: ", key);
      }
    }
    console.log("Total entries: ", t);
    this.archiveItems = unZippedFiles;

    await this.buildMediaMap();
    const itemsSize = new TextEncoder().encode(JSON.stringify(unZippedFiles)).length;
    const mediaSize = new TextEncoder().encode(JSON.stringify(this.media)).length;
    this.archiveSize = convertBytesToString(itemsSize + mediaSize); // TODO: keep separate?
  }

  async buildMediaMap() {
    const {
      tweet: tweets,
      profile: { avatarMediaUrl: amu },
    } = this.archiveItems;
    let mediaId = amu.substring(amu.lastIndexOf("/") + 1, amu.length);
    this.media[mediaId] = await this.mediaUrlToDataUri(amu);

    for (let tweet of tweets) {
      /* two references of media arrays in a tweet:
      1. entities.media (media displayed in the tweet)
      2. extended_entities.media (media stored in the tweet)
      */
      const { extended_entities, entities } = tweet;
      if (!extended_entities) {
        continue;
      }
      await this.updateMediaPropertiesWithDataUri(entities.media);
      await this.updateMediaPropertiesWithDataUri(extended_entities.media);
    }
  }

  async updateMediaPropertiesWithDataUri(mediaArray: any) {
    for (let mediaObj of mediaArray) {
      const { media_url_https, video_info } = mediaObj;
      // extract the media id from the url
      const mediaId = media_url_https.substring(
        media_url_https.lastIndexOf("/") + 1,
        media_url_https.length
      );
      if (!(mediaId in this.media)) {
        this.media[mediaId] = await this.mediaUrlToDataUri(media_url_https);
      }
      // if tweet contains video, replace the video url with the data uri
      if (video_info) {
        for (let variant of video_info.variants) {
          let vurl = variant.url;
          // extract the media id from the url
          let videoId = vurl.substring(vurl.lastIndexOf("/") + 1, vurl.length);
          if (!(videoId in this.media)) {
            this.media[videoId] = await this.mediaUrlToDataUri(vurl);
          }
        }
      }
    }
  }

  // fetch content from media url and convert it to a data uri (base64)
  async mediaUrlToDataUri(url: string) {
    // console.log("fetching: ", url);
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((callback) => {
      let reader = new FileReader();
      reader.onload = function () {
        callback(this.result);
      };
      reader.readAsDataURL(blob);
    });
  }

  async internalUnzip() {
    return JSZip.loadAsync(this.file).then(async (zip: JSZip) => {
      console.log("Total entries in zip: ", Object.keys(zip.files).length);
      return this.extract(zip);
    });
  }
}
