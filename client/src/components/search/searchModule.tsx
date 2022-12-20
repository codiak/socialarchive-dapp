import { Beejs } from "@process/Beejs";

export function search(searchString: string) {
  const bee = new Beejs();

  return bee.getFeed()
    .then(res => {
      const searchResults = {};

      for(const key in res) {
        const regex = new RegExp(searchString, "ig");

        if(regex.test(key))
          searchResults[key] = res[key];
      }

      return searchResults;
    });
}
