import { Beejs } from "../../process/Beejs";

export function search(searchString: string) {
  const bee = new Beejs();

  return bee.feedReader.download()
  .then(res => {
    return res;
  });
}
