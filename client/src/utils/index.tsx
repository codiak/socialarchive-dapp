import { Utils } from "@ethersphere/bee-js";

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export const convertBytesToString = (bytes: number, dp: number = 1) => {
  const thresh = 1000;

  if (Math.abs(bytes) < thresh) {
    return bytes + " Bytes";
  }

  const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + " " + units[u];
};

/**
 * Calculates size of a JSON object.
 *
 * @param json JSON object.
 *
 * @return Size of JSON object formatted as a string.
 *
 */
export const getJsonSize = (json: any) => {
  const size = new TextEncoder().encode(JSON.stringify(json)).length;
  return convertBytesToString(size);
};

/**
 * Converts Swarm's feedIndex to integer.
 *
 * @param feedIndex String value of feed index e.g. 0000000000000001
 *
 * @return Converted integer value
 *
 */
export const convertFeedIndexToInt = (feedIndex: string) => {
  try {
    const indexBytes = Utils.hexToBytes(feedIndex);
    let index = 0;
    for (let i = indexBytes.length - 1; i >= 0; i--) {
      const byte = indexBytes[i];
      if (byte === 0) break;
      index += byte;
    }
    return index;
  } catch (error) {
    console.log("error converting feedIndex to int", error);
    throw error;
  }
};

/**
 * Creates a png image from ASCII art characters
 *
 * @param asciiLines Contains the ASCII characters by line
 *
 * @return data uri of the generated ASCII png
 *
 */
export const createImageFromAscii = (asciiLines: []) => {
  try {
    // The canvas we are going to use to create the image
    let canvas = document.createElement("canvas");
    let targetWidth = 713;
    canvas.width = targetWidth;
    canvas.height = 908;
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // ASCII art settings
    ctx.font = "12px monospace";
    let lineHeight = 9;
    let height = 1;
    let opacity = 10;

    // Draw the ASCII lines
    // eslint-disable-next-line array-callback-return
    asciiLines.map((line: string) => {
      // TODO This darkens the image, could employ a better approach via css or filters
      for (let j = 0; j < opacity; j++) {
        ctx.fillText(line, 0, lineHeight * height);
      }
      height++;
    });

    // Convert the canvas to a data uri
    return canvas.toDataURL();
  } catch (error) {
    console.log("error creating ascii image: ", error);
  }
};

/**
 * Converts an image to ASCII art
 * Based on https://web.archive.org/web/20180331191700/http://mattmik.com/articles/ascii/ascii.html
 *
 * @param imageRef Reference to an image. Can be a url, relative path or data uri
 *
 * @return array of ASCII characters lines representing the image
 *
 */
export const convertImageToAscii = (imageRef: string) => {
  if (imageRef === null || undefined) return;
  return new Promise((resolve, reject) => {
    let image = new Image();

    // For loading remote images, else results in a cross origin error
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = () => {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      let ratio = image.width / image.height;

      // Scale the image to the desired dimensions, hi-res
      let columns = 100;
      canvas.width = columns;
      canvas.height = columns / ratio;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Retrieve the image data from the HTMLCanvasElement that contains the image
      let data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      // Calculate the average brightness for a tile
      for (let i = 0; i < data.length; i += 4) {
        let brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        data[i] = brightness;
      }

      // ASCII Art Options, dark to light
      let map = "@#%*+=-:. ";

      // Map the tile's brightness to an ASCII character
      let asciiChars = [];
      let startLineIndex = 0;
      let endLineIndex = 0;
      let asciiLines = [];

      for (let i = 0; i < data.length; i += 4) {
        let rchar = map[Math.round(((map.length - 1) * data[i]) / 255)];
        asciiChars.push(rchar);
        if (Math.ceil((i + 1) / 4) % columns === 0) {
          asciiChars.push("\n");
          endLineIndex = asciiChars.length;
          let line = asciiChars.slice(startLineIndex, endLineIndex).join("");
          asciiLines.push(line);
          startLineIndex = endLineIndex + 1;
        }
      }
      // TODO add color
      // console.log("asciichars", asciiChars.join(""));

      resolve(asciiLines);
    };
    image.onerror = reject;
    image.src = imageRef;
  });
};
