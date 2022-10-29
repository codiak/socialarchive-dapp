import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import * as glMock from '../../../src/mocks/components/auth/getLogin.js';
import { login } from '../../../src/components/auth/authModule.js';

chai.use(chaiaspromised);
const { expect } = chai;

describe("login", function() {
    it("Login2 should fetch auth url", function() {
        return login()
            .then(res => {
                expect(res).to.have.property('access_token');
            });
    });
});
