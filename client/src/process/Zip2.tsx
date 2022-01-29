import JSZip from "jszip";

export const unzipTwitterArchive = async (twitterArchive: any) => {
  const mediaMap = {} as any;
  let archiveItems = {} as any;
  let i = 0;
  let t = 0;

  // clean up and rearrange for our consumption
  function formatData(json: any, filename: any) {
    try {
      if (json.length === undefined) {
        let propName = filename.substring(0, filename.indexOf("."));
        return { [propName]: json };
      }
      let name = Object.keys(json[0])[0];
      // console.log("format: name: ", name);
      if (["tweet.js", "like.js", "following.js", "follower.js", "mute.js", "block.js"].includes(filename)) {
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

  function extractJson(file: any) {
    return new Promise<any>((resolve, reject) => {
      file.async("string").then((content: string) => {
        let fname = file.name.replace("data/", ""); // strip out folder name
        let json = {} as any;
        try {
          // remove var
          let c = content.substring(content.indexOf("=") + 1, content.length).trim();
          // don't need to parse or resolve if substring contains only 3 characters -> empty array;
          if (c.length > 3) {
            json = formatData(JSON.parse(c), fname);
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

  function extractMedia(file: any, type: string) {
    return new Promise<any>((resolve, reject) => {
      const name = file.name.replace("data/", "").substring(file.name.lastIndexOf("/") + 1, file.name.length); // strip out folder names
      // TODO: handle ALL media types
      // don't need to parse or resolve if substring contains only 3 characters -> empty array;
      let video = type === "mp4" ? "video/mp4" : null;
      let audio = type === "mp3" ? "audio/mp3" : null;
      let image = type !== "mp4" && type !== "mp3" ? "image/" + type : null;
      const dataUrlProlog = "data:" + (video !== null ? video : image !== null ? image : audio !== null ? audio : null) + ";base64,";
      let processedFile = {
        name,
        type,
        data: "",
        id: "",
        category: "media",
      };
      file.async("base64").then((content: any) => {
        try {
          processedFile.data = dataUrlProlog + content;
          if (processedFile.name.includes("-")) {
            processedFile.id = processedFile.name.substring(processedFile.name.lastIndexOf("-") + 1, processedFile.name.length);
          }
          console.log("Add media: ", processedFile);
          resolve(processedFile);
        } catch (e) {
          console.log("Error parsing media: ", e);
          reject(processedFile);
        }
      });
    });
  }

  const extractFile = async (file: any) => {
    let extractedFile = undefined;
    // all js files are json :)
    if (file.name.endsWith(".js")) {
      // console.log("Extracting json file: ", file.name);
      try {
        extractedFile = await extractJson(file);
      } catch (e) {
        // console.log("file name: ", file.name);
        // console.log("Skip: no data: ", file.name, e);
      }
    } else if (file.name.endsWith(".mp4") || file.name.endsWith(".jpg") || file.name.endsWith(".mp3") || file.name.endsWith(".png")) {
      try {
        extractedFile = await extractMedia(file, file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length));
      } catch (e) {
        // console.log("Skip: no media data: ", file.name, e);
      }
    } else {
      // console.log("Skip: ", file);
    }
    return extractedFile;
  };

  const extract = async (zip: JSZip) => {
    console.log("Building archive");
    /* typical twitter backup zip file structure
    twitter_backup.zip
      + assets          <-- folder contains artifacts used by twitter html page, skip
      + data            <-- folder we are interested in
      Your archive.html <-- skip this file
    */
    for (var key in zip.files) {
      const file = zip.files[key];
      // if entry is a directory skip it (for now)
      if (!file.dir) {
        // process files that are under the data folder
        if (key.includes("data")) {
          const extractedFile = await extractFile(file);

          if (extractedFile !== undefined) {
            const { id, category } = extractedFile;

            if (category === "media") {
              mediaMap[id] = extractedFile.data
            } else {
              archiveItems = { ...archiveItems, ...extractedFile };
            }
          }
        }
      } else {
        // console.log("Skip: Entry === directory name: ", key);
      }
    }
    console.log("Total entries: ", t);
  };

  const zip: JSZip = await JSZip.loadAsync(twitterArchive);
  console.log("Total entries in zip: ", Object.keys(zip.files).length);
  await extract(zip);

  async function updateMediaPropertiesWithDataUri(mediaArray: any) {
    for (let mediaObj of mediaArray) {
      const {media_url_https, video_info} = mediaObj;
      // extract the media id from the url
      const mediaId = media_url_https.substring(media_url_https.lastIndexOf("/") + 1, media_url_https.length);
      if (!(mediaId in mediaMap)) {
        const mediaDataUrl = await mediaUrlToDataUri(media_url_https);
        mediaMap[mediaId] = mediaDataUrl;
      }
      // if tweet contains video, replace the video url with the data uri
      if (video_info) {
        for (let variant of video_info.variants) {
          let vurl = variant.url;
          // extract the media id from the url
          let videoId = vurl.substring(vurl.lastIndexOf("/") + 1, vurl.length);
          if (!(videoId in mediaMap)) {
            const mediaDataUrl = await mediaUrlToDataUri(vurl);
            mediaMap[videoId] = mediaDataUrl;
          }
        }
      }
    }
  }
  // fetch content from media url and convert it to a data uri (base64)
  async function mediaUrlToDataUri(url: string) {
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

  const amu = archiveItems.profile?.avatarMediaUrl;
  if (amu) {
    const mediaId = amu.substring(amu.lastIndexOf("/") + 1, amu.length);
    const goodUrl = 'https://pbs.twimg.com/profile_images/1483539661859561472/sHsDFLCV_400x400.jpg';
    const mediaDataUrl = await mediaUrlToDataUri(goodUrl);
    mediaMap[mediaId] = mediaDataUrl;
  }

  for (let tweet of archiveItems.tweet) {
    /* two references of media arrays in a tweet:
    1. entities.media (media displayed in the tweet)
    2. extended_entities.media (media stored in the tweet)
    */
    const { extended_entities, entities } = tweet;
    if (!extended_entities) {
      continue;
    }

    await updateMediaPropertiesWithDataUri(entities.media);
    await updateMediaPropertiesWithDataUri(extended_entities.media);
  }
  const itemsSize = new TextEncoder().encode(JSON.stringify(archiveItems)).length;
  const mediaSize = new TextEncoder().encode(JSON.stringify(mediaMap)).length;
  const archiveSize = itemsSize + mediaSize;
  const archive = { archiveSize, archiveItems, mediaMap };

  return archive;
};
