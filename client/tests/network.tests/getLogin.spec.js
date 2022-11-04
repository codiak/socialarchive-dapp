import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import { init } from '../../src/components/auth/getLogin.js';

chai.use(chaiaspromised);
const { expect } = chai;

describe('GetLogin module', function() {
  this.timeout(7000);

  it("Init", function() {
    const accessToken = process.env.REACT_APP_TEST_ACCESS_TOKEN;
    console.log("access token:", accessToken);

    return init(accessToken)
      .then(res => {
        expect(res).to.be.true;
      });
  });
});
