import JSZip from "jszip";
let i = 0;
let t = 0;
export class Zip {
  file: any;
  unzippedFiles: any;

  constructor(file: any) {
    this.file = file;
  }

  static async unzip(file: any) {
    const zip = new Zip(file);
    await zip.internalUnzip();
    return zip.unzippedFiles;
  }

  async extractFile(file: any) {
    let extractedFile = undefined;

    // all js files are json :)
    if (file.name.endsWith(".js")) {
      // // console.log("Extracting json file: ", file.name);
      try {
        extractedFile = await this.extractJson(file);
      } catch (e) {
        // // console.log("file name: ", file.name);
        // // console.log("Skip: no data: ", file.name, e);
      }
    } else if (file.name.endsWith(".mp4") || file.name.endsWith(".jpg") || file.name.endsWith(".mp3") || file.name.endsWith(".png")) {
      try {
        extractedFile = await this.extractMedia(file, file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length));
      } catch (e) {
        // // console.log("Skip: no media data: ", file.name, e);
      }
    } else {
      // // console.log("Skip: ", file);
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
      // // console.log("format: name: ", name);
      if (["tweet.js", "like.js", "following.js", "follower.js", "mute.js", "block.js"].includes(filename)) {
        json = { [name]: json.map((t: any) => t[name]) };
      } else {
        if (json.length > 1) {
          let plural = name + "s";
          // this is a ugly hack, need to compare the various ad data files and merge them somehow using the timestamps
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
    let extractedJson = new Promise<any>((resolve, reject) => {
      file.async("string").then((content: string) => {
        let fname = file.name.replace("data/", ""); // strip out folder name
        let json = {} as any;
        try {
          // remove var
          let c = content.substring(content.indexOf("=") + 1, content.length).trim();
          // don't need to parse or resolve if substring contains only 3 characters -> empty array;
          if (c.length > 3) {
            json = this.formatData(JSON.parse(c), fname);
            // console.log("Add: ", json);
            t++;
            resolve(json);
          } else {
            reject(json);
          }
        } catch (e) {
          // console.log("Error parsing json : ", e);
          reject(json);
        }
      });
    });
    return extractedJson;
  }

  extractMedia(file: any, type: string) {
    let extractedMedia = new Promise<any>((resolve, reject) => {
      file.async("base64").then((content: any) => {
        let proccessedFile = {
          name: file.name.replace("data/", "").substring(file.name.lastIndexOf("/") + 1, file.name.length), // strip out folder names
          type,
          data: "",
          id: "",
          category: "media",
        };
        try {
          // TODO: handle ALL media types
          // don't need to parse or resolve if substring contains only 3 characters -> empty array;
          let video = type === "mp4" ? "video/mp4" : null;
          let audio = type === "mp3" ? "audio/mp3" : null;
          let image = type !== "mp4" && type !== "mp3" ? "image/" + type : null;
          proccessedFile.data = "data:" + (video !== null ? video : image !== null ? image : audio !== null ? audio : null) + ";base64," + content;
          if (proccessedFile.name.includes("-")) {
            proccessedFile.id = proccessedFile.name.substring(proccessedFile.name.lastIndexOf("-") + 1, proccessedFile.name.length);
          }
          // console.log("Add media: ", proccessedFile);
          resolve(proccessedFile);
        } catch (e) {
          // console.log("Error parsing media: ", e);
          reject(proccessedFile);
        }
      });
    });
    return extractedMedia;
  }

  async extract(zip: JSZip) {
    // let unZippedFiles: { name: string; type: string; data: {} }[] = [];
    let unZippedFiles = {} as any;
    // console.log("Building social archive twitter dataset");

    /* typcial twitter backup zip file structure
    twitter_backup.zip
      + assets          <-- folder contains artifacts used by twitter html page, skip
      + data            <-- folder we are interested in
      Your archive.html <-- skip this file
    */
    // iterate over media contents and add to unzippedFiles array
    let media = [];
    for (var key in zip.files) {
      let file = zip.files[key];

      // if entry is a directory skip it (for now)
      if (!file.dir) {
        // process files that are under the data folder
        if (key.includes("data")) {
          let extractedFile = await this.extractFile(file);
          if (extractedFile !== undefined) {
            // Object.assign(unZippedFiles, extractedFile);
            if (extractedFile.category === "media") {
              // @ts-ignore
              media.push(extractedFile);
              unZippedFiles = { ...unZippedFiles, media };
            } else {
              unZippedFiles = { ...unZippedFiles, ...extractedFile };
            }
          }
        }
      } else {
        // // console.log("Skip: Entry === directory name: ", key);
      }
    }

    // update media references in tweets
    await this.replaceMediaLinks(unZippedFiles);
    // console.log("Total entries: ", t);
    // console.log("Built social archive twitter dataset: ", unZippedFiles);
    return unZippedFiles;
  }

  async replaceMediaLinks(unZippedFiles: any) {
    let midUri = new Map();
    let tweetsWithMedia: any[] = [];

    // eslint-disable-next-line array-callback-return
    for (let file of unZippedFiles.media) {
      // add media id and data uri to a map, used for replacing media links in the tweet.js file
      midUri.set(file.id, file.data);
    }
    // filter tweets that contain media, extended entities is always present for tweets with media
    tweetsWithMedia = unZippedFiles.tweet.filter((obj2: any) => {
      return obj2.extended_entities !== undefined;
    });

    let amu = unZippedFiles.profile.avatarMediaUrl;
    let mediaId = amu.substring(amu.lastIndexOf("/") + 1, amu.length);
    unZippedFiles.profile.avatarMediaUrl = midUri.get(mediaId);

    // replace media links with data uri
    for (let tweet of tweetsWithMedia) {
      /* two references of media arrays in a tweet:
      1. entities.media (media displayed in the tweet)
      2. extended_entities.media (media stored in the tweet)
      */
      // // console.log("entities.media");
      await this.updateMediaPropertiesWithDataUri(tweet.entities.media, midUri);
      // // console.log("extended_entities.media");
      await this.updateMediaPropertiesWithDataUri(tweet.extended_entities.media, midUri);
    }
    // console.log("Update urls with data uris in profile and tweets (" + tweetsWithMedia.length + ")");
  }

  async updateMediaPropertiesWithDataUri(media: any, midUri: any) {
    for (let mediaObj of media) {
      let murl = mediaObj.media_url_https;
      // extract the media id from the url
      let mediaId = murl.substring(murl.lastIndexOf("/") + 1, murl.length);
      // check if the media id is in the map
      if (midUri.has(mediaId)) {
        // if it is, replace the media url with the data uri
        // // console.log("media id found in map: ", mediaId, " avoided fetching media");
        mediaObj.media_url = midUri.get(mediaId);
        // update the second property of the media object too
        mediaObj.media_url_https = mediaObj.media_url;
      } else {
        // // console.log("media id not found in map: ", mediaId);
        // if not, download the media and replace the url with the data uri
        mediaObj.media_url = await this.mediaUrlToDataUri(mediaObj.media_url_https);
        // update the second property of the media object too
        mediaObj.media_url_https = mediaObj.media_url;
        // add the media id and data uri to the map
        // // console.log("+ id and uri to map:", mediaId);
        midUri.set(mediaId, mediaObj.media_url);
      }

      // if tweet contains video, replace the video url with the data uri
      if (mediaObj.video_info) {
        // // console.log("video info: ", mediaObj.video_info);
        for (let variant of mediaObj.video_info.variants) {
          let vurl = variant.url;
          // extract the media id from the url
          let videoId = vurl.substring(vurl.lastIndexOf("/") + 1, vurl.length);
          // check if the media id is in the map
          if (midUri.has(videoId)) {
            // if it is, replace the media url with the data uri
            // // console.log("video id found in map: ", videoId, " avoided fetching media");
            variant.url = midUri.get(videoId);
          } else {
            // // console.log("video id not found in map: ", videoId);
            // if not, download the media and replace the url with the data uri
            variant.url = await this.mediaUrlToDataUri(variant.url);
            // add the media id and data uri to the map
            // // console.log("+ id and uri to map:", videoId);
            midUri.set(videoId, variant.url);
          }
        }
      }
      // // console.log("map size: ", midUri.size);
      // // console.log("updated object: ", mediaObj);
    }
  }

  // fetch content from media url and convert it to a data uri (base64)
  async mediaUrlToDataUri(url: string) {
    // // console.log("fetching: ", url);
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
      // // console.log("Zipped file contents: ", zip);
      // console.log("Total entries in zip: ", Object.keys(zip.files).length);
      this.unzippedFiles = this.extract(zip);
    });
  }
}
