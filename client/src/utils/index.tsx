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
 * @param feedIndex feedIndex string value e.g. 0000000000000001
 *
 * @return Converted integer value
 *
 */
export const convertFeedIndexToInt = (feedIndex: string): number => {
  const indexBytes = Utils.hexToBytes(feedIndex);
  let index = 0;
  for (let i = indexBytes.length - 1; i >= 0; i--) {
    const byte = indexBytes[i];
    if (byte === 0) break;
    index += byte;
  }
  return index;
};
