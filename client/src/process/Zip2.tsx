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

  async extract(zip: JSZip) {
    let unzippedFiles: { name: string; type: string; data: {} }[] = [];
    // console.log("Extracting files...");

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
        // only process files that are under the data folder
        if (key.includes("data")) {
          // // console.log("Name: ", key);
          // // console.log("file: ", file);

          // all js files are json :)
          if (file.name.includes(".js")) {
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
                    // console.log("Add: ", proccessedFile);
                    resolve(proccessedFile);
                  } else {
                    reject(proccessedFile);
                  }
                } catch (e) {
                  // console.log("Error parsing json : ", e);
                  reject(proccessedFile);
                }
              });
            });
            try {
              unzippedFiles.push(await extractedJson);
            } catch (e) {
              // console.log("Skip: no data: ", e);
              // console.error("Rejected file, no data : ", e);
            }
          } else {
            // console.log("Skip: ", file.name);
          }
        }
      } else {
        // console.log("Skip: Entry === directory name: ", key);
      }
    }
    return unzippedFiles;
  }

  async internalUnzip() {
    return JSZip.loadAsync(this.file).then(async (zip: JSZip) => {
      // console.log("Zipped file contents: ", zip);
      // console.log("Total entries: ", Object.keys(zip.files).length);
      this.unzippedFiles = this.extract(zip);
    });
  }
}
