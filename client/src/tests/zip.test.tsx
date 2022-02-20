import fs from "fs";
import path from "path";

if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder } = require("util");
  global.TextEncoder = TextEncoder;
}

jest.setTimeout(1000000);

let runs = [];

test("unzip twitter archive", async () => {
  const file = fs.readFileSync(path.resolve(__dirname, "../data/twitter-2022-01-05-1cf918071879ce2e0b26b27ea454a1c49eb6956715f15a019a728a92fc238a69.zip"));
  // const file = fs.readFileSync(path.resolve(__dirname, "../data/twitter-2022-02-05-kirlen.zip"));

  for (let i = 0; i < 2; i++) {
    await testZipFiles(file, i);
  }

  console.table(runs);
});

const testZipFiles = async (file, iteration) => {
  for (let i = 0; i <= 12; i++) {
    let fileName = "Zip" + (i > 0 ? i : "");
    await import(`../process/${fileName}`).then(async ({ Zip }) => {
      console.log("Zip version: ", fileName);
      const start = performance.now();
      await Zip.unzip(file);
      const end = performance.now();
      const archiveBuildTime = Math.round(end - start);

      let obj = {
        fileName,
        archiveBuildTime,
      };
      let obj0 = {
        [iteration]: obj,
      };
      runs.push(obj0);
      console.log("Time to unzip: ", end - start);
    });
  }
};
