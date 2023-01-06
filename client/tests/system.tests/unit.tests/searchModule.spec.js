import { search } from "../../../src/components/search/searchModule";
import {__stub, Beejs } from "@process/Beejs";
import { faker } from "@faker-js/faker";
import sinon from "sinon";
import { expect } from "chai";

describe.only("Search module", function() {
  it("Call bee.getFeed() on search", function() {
    const spy = sinon.fake.resolves(true);
    // sinon.stub(beejs, "Beejs");
    __stub("getFeed", spy);

    return search(faker.lorem.word())
      .then(res => {
        sinon.assert.called(spy);
      });
  });

  it("Return all usernames and hashes that match search term", function() {
    sinon.restore();

    const results = {
      "amapblah": faker.git.commitSha(),
      "blah": faker.git.commitSha(),
      "omblahpon": faker.git.commitSha(),
      "blahmon": faker.git.commitSha(),
    }

    const feed = {
      ...results,
      "amaple": faker.git.commitSha(),
      "frugal": faker.git.commitSha(),
    }

    const spy = sinon.fake.resolves(feed);
    __stub("getFeed", spy);

    return search("blah")
      .then(res => {
        expect(res).to.eql(results);
      });
  });
});
