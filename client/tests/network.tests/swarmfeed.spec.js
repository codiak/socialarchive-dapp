import { Beejs } from "../../src/process/Beejs";
import sinon from 'sinon';
import { faker } from '@faker-js/faker';

import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
chai.use(chaiaspromised);
const { expect } = chai;

describe("Swarm feeds", function() {
  this.timeout(30000);

  it("Save key value to key value store and retrieve it", function() {
    const bee = new Beejs();
    const key = faker.lorem.word(),
      value="f4a1e830c71fa6b35959de1f1d2dffd82d2aa2bf33c0ca061d95709769ad7621",

      key2 = faker.lorem.word(),
      value2="f4a1e830c71fa6b35959de1f1d2dffd82d2aa2bf33c0ca061d95709769ad7621";

    return bee.saveSwarmHashInFeed(key, value)
      .then(() => bee.saveSwarmHashInFeed(key2, value2))
      .then(() => bee.getFeed())
      .then(res => {
        expect(res).to.contain({
          [key]: value,
          [key2]: value2,
        });
      });
  });
});
