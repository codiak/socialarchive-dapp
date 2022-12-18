import { Beejs } from "../../src/process/Beejs";

describe.only("Swarm feeds", function() {
  it("Retrieve from feed", function() {
    const bee = new Beejs();

    console.log("bee:", bee);

    return bee.feedReader.download()
      .then(res => {
        console.log("feader data:", res);
      });
  });
});
