import JSZip from "jszip";
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
      try {
        extractedFile = await this.extractJson(file);
      } catch (e) {
        console.log("Skip: no data: ", e);
      }
    } else if (file.name.endsWith(".jpg") || file.name.endsWith(".png") || file.name.endsWith(".mp4")) {
      try {
        extractedFile = await this.extractMedia(file, file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length));
      } catch (e) {
        console.log("Skip: no data: ", e);
      }
    } else {
      console.log("Skip: ", file);
    }
    return extractedFile;
  }

  extractJson(file: any) {
    let extractedJson = new Promise<any>((resolve, reject) => {
      file.async("string").then((content: string) => {
        let proccessedFile = {
          name: file.name.replace("data/", ""), // strip out folder name
          type: "json",
          data: undefined,
        };
        try {
          // remove var
          let c = content.substring(content.indexOf("=") + 1, content.length).trim();
          // don't need to parse or resolve if substring contains only 3 characters -> empty array;
          if (c.length > 3) {
            proccessedFile.data = JSON.parse(c);
            console.log("Add: ", proccessedFile);
            resolve(proccessedFile);
          } else {
            reject(proccessedFile);
          }
        } catch (e) {
          console.log("Error parsing json : ", e);
          reject(proccessedFile);
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
        };
        try {
          // don't need to parse or resolve if substring contains only 3 characters -> empty array;
          proccessedFile.data = "data:" + (type === "mp4" ? "video/mp4" : "image/" + type) + ";base64," + content;
          if (proccessedFile.name.includes("-")) {
            proccessedFile.id = proccessedFile.name.substring(proccessedFile.name.lastIndexOf("-") + 1, proccessedFile.name.length);
          }
          console.log("Add: ", proccessedFile);
          resolve(proccessedFile);
        } catch (e) {
          console.log("Error parsing media : ", e);
          reject(proccessedFile);
        }
      });
    });
    return extractedMedia;
  }

  async extract(zip: JSZip) {
    let unZippedFiles: { name: string; type: string; data: {} }[] = [];
    console.log("Extracting files...");

    /* typcial twitter backup zip file structure
    twitter_backup.zip
      + assets          <-- folder contains artifacts used by twitter html page, skip
      + data            <-- folder we are interested in
      Your archive.html <-- skip this file
    */
    // iterate over zip contents and add to unzippedFiles array
    for (var key in zip.files) {
      let file = zip.files[key];

      // if entry is a directory skip it (for now)
      if (!file.dir) {
        // process files that are under the data folder
        if (key.includes("data")) {
          let extractedFile = await this.extractFile(file);
          if (extractedFile !== undefined) {
            unZippedFiles.push(extractedFile);
          }
        }
      } else {
        console.log("Skip: Entry === directory name: ", key);
      }
    }

    // update media references in tweets
    await this.replaceMediaLinks(unZippedFiles);

    return unZippedFiles;
  }

  async replaceMediaLinks(unZippedFiles: any[]) {
    console.log("Replace media links with data uris in tweets");

    let midUri = new Map();
    let tweetsWithMedia: any[] = [];

    // eslint-disable-next-line array-callback-return
    for (let file of unZippedFiles) {
      // add media id and data uri to a map, used for replace media links in the tweet.js file
      if (file.type !== "json") {
        // console.log("+ id and uri to map:", file.id);
        midUri.set(file.id, file.data);
      }
      // find the tweets file in the zip file
      if (file.name === "tweet.js") {
        // filter tweets that contain media, extended entities is always present for tweets with media
        tweetsWithMedia = file.data.filter((obj2: any) => {
          return obj2.tweet.extended_entities !== undefined;
        });
        console.log("Total tweets with media: ", tweetsWithMedia.length);
      }
    }

    // console.log("tweetsWithMedia: ", tweetsWithMedia);
    // console.log("map size: ", midUri.size);

    // replace media links with data uri
    for (let { tweet } of tweetsWithMedia) {
      // console.log("tweet: ", tweet);

      /* two references of media arrays in a tweet:
      1. entities.media (media displayed in the tweet)
      2. extended_entities.media (media stored in the tweet)
      */

      console.log("entities.media");
      await this.updateMediaPropertiesWithDataUri(tweet.entities.media, midUri);
      console.log("extended_entities.media");
      await this.updateMediaPropertiesWithDataUri(tweet.extended_entities.media, midUri);
    }
  }

  async updateMediaPropertiesWithDataUri(media: any, midUri: any) {
    for (let mediaObj of media) {
      let murl = mediaObj.media_url;
      // extract the media id from the url
      let mediaId = murl.substring(murl.lastIndexOf("/") + 1, murl.length);
      // check if the media id is in the map
      if (midUri.has(mediaId)) {
        // if it is, replace the media url with the data uri
        // console.log("media id found in map: ", mediaId, " avoided fetching media");
        mediaObj.media_url = midUri.get(mediaId);
        // update the second property of the media object too
        mediaObj.media_url_https = mediaObj.media_url;
      } else {
        // console.log("media id not found in map: ", mediaId);
        // if not, download the media and replace the url with the data uri
        mediaObj.media_url = await this.mediaUrlToDataUri(mediaObj.media_url);
        // update the second property of the media object too
        mediaObj.media_url_https = mediaObj.media_url;
        // add the media id and data uri to the map
        // console.log("+ id and uri to map:", mediaId);
        midUri.set(mediaId, mediaObj.media_url);
      }

      // if tweet contains video, replace the video url with the data uri
      if (mediaObj.video_info) {
        // console.log("video info: ", mediaObj.video_info);
        for (let variant of mediaObj.video_info.variants) {
          let vurl = variant.url;
          // extract the media id from the url
          let videoId = vurl.substring(vurl.lastIndexOf("/") + 1, vurl.length);
          // check if the media id is in the map
          if (midUri.has(videoId)) {
            // if it is, replace the media url with the data uri
            // console.log("video id found in map: ", videoId, " avoided fetching media");
            variant.url = midUri.get(videoId);
          } else {
            // console.log("video id not found in map: ", videoId);
            // if not, download the media and replace the url with the data uri
            variant.url = await this.mediaUrlToDataUri(variant.url);
            // add the media id and data uri to the map
            // console.log("+ id and uri to map:", videoId);
            midUri.set(videoId, variant.url);
          }
        }
      }
      // console.log("map size: ", midUri.size);
      console.log("updated object: ", mediaObj);
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
      console.log("Zipped file contents: ", zip);
      console.log("Total entries: ", Object.keys(zip.files).length);
      this.unzippedFiles = this.extract(zip);
    });
  }
}
