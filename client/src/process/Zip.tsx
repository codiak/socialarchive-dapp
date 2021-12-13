import JSZip from "jszip";
export class Zip {
  file: any;
  unzippedFiles: any;

  constructor(file: any) {
    // limit to one file for now
    this.file = file;
  }

  static async unzip(file: any) {
    const zip = new Zip(file);
    await zip.internalUnzip();
    return zip.unzippedFiles;
  }

  async extract(zip: JSZip) {
    let unzippedFiles: { name: string; type: string; data: {} }[] = [];
    console.log("extracting files...");

    /* typcial twitter backup zip file structure
    twitter_backup.zip
      + assets          <-- folder contains artifacts used by twitter html page, skip
      + data            <-- folder we are interested in
      Your archive.html <-- skip this file
    */
    // iterate over zip contents and add to unzippedFiles array
    for (var key in zip.files) {
      console.log("name: ", key);
      let file = zip.files[key];

      // if entry is a directory skip it (for now)
      if (!file.dir) {
        // only process files that are under the data folder
        if (key.includes("data")) {
          console.log("file: ", file);
          // all js files are json :)
          if (file.name.includes(".js")) {
            let extractedJson = new Promise<{ name: string; type: string; data: {} }>((resolve, reject) => {
              file.async("string").then((content: string) => {
                let proccessedFile = {
                  name: file.name,
                  type: "json",
                  data: {},
                };
                // remove var
                let c = content.substring(content.indexOf("=") + 1, content.length).trim();
                // console.log("zip entry c: ", c);
                try {
                  proccessedFile.data = JSON.parse(c);
                  resolve(proccessedFile);
                } catch (e) {
                  console.log("Error parsing json : ", e);
                  reject(proccessedFile);
                  throw e;
                }
              });
            });
            unzippedFiles.push(await extractedJson);
          }
        }
      } else {
        console.log("skipped directory");
      }
    }
    return unzippedFiles;
  }

  async internalUnzip() {
    return JSZip.loadAsync(this.file).then(async (zip: JSZip) => {
      console.log("zipped file contents: ", zip);
      console.log("total entries: ", Object.keys(zip.files).length);
      this.unzippedFiles = this.extract(zip);
    });
  }
}
