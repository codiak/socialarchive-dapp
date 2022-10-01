import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import * as glMock from '../../../src/mocks/components/auth/getLogin.js';
import { login, setAccessToken } from '../../../src/components/auth/authModule.js';

chai.use(chaiaspromised);
const { expect } = chai;

describe("Authentication module: unit tests", function() {
    beforeEach(() => {
        window.localStorage.clear();
        window.location.hash = '';
    });

    function mockUserData() {
        return {
            username: faker.internet.userName(),
            usernameHash: '0x' + faker.random.alphaNumeric(64)
        }
    }

    it('Login: encrypt and save access token to localstorage', function() {
        glMock.__stub('login', sinon.fake.resolves(true));
        glMock.__stub('userInfo', sinon.fake.resolves(mockUserData()));

        // Set url to one with auth token
        const token = faker.random.alphaNumeric(25);
        window.location.hash = `access_token=${token}`;

        return login()
            .then(res => {
                const storedToken = window.localStorage.getItem('access_token');
                expect(storedToken).to.not.be.null;
                expect(storedToken).to.not.be.undefined;
                expect(storedToken).to.be.a('string');
                expect(storedToken).to.not.equal('undefined');

                expect(storedToken).to.not.equal(token);
            });
    });

    it('If encrypted token has been stored, should decrypttoken and call login with token', function() {
        const spy = sinon.fake.resolves(mockUserData());
        glMock.__stub('login', spy);
        glMock.__stub('userInfo', sinon.fake.resolves(mockUserData()));

        // Set url to one with auth token
        const token = faker.random.alphaNumeric(25);

        return setAccessToken(token)
            .then(() => login())
            .then(res => {
                sinon.assert.calledWith(spy, token);
            });
    });

    it('Login: do not save access token if gl login fails', function() {
        glMock.__stub('login', sinon.fake.rejects('App currently not allowed by user'));
        glMock.__stub('userInfo', sinon.fake.resolves(mockUserData()));
        const token = faker.random.alphaNumeric(25);

        window.location.hash = `access_token=${token}`;

        return expect(login()).to.be.rejected
            .then(() => {
                const storedToken = window.localStorage.getItem('access_token');
                expect(storedToken).to.be.null;
            });
    });
});
