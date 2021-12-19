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
    if (file.name.includes(".js")) {
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
    let unzippedFiles: { name: string; type: string; data: {} }[] = [];
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
            unzippedFiles.push(extractedFile);
          }
        }
      } else {
        console.log("Skip: Entry === directory name: ", key);
      }
    }
    return unzippedFiles;
  }

  async internalUnzip() {
    return JSZip.loadAsync(this.file).then(async (zip: JSZip) => {
      console.log("Zipped file contents: ", zip);
      console.log("Total entries: ", Object.keys(zip.files).length);
      this.unzippedFiles = this.extract(zip);
    });
  }
}
