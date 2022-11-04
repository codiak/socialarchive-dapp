import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import * as glMock from '../../../src/mocks/components/auth/getLogin.js';
import * as cEncryptMock from '../../../src/mocks/components/auth/clientEncrypt.js';
import { login, logout, encrypt, decrypt } from '../../../src/components/auth/authModule.js';

import { mockUserData } from "../../helpers";

chai.use(chaiaspromised);
const { expect } = chai;

describe("Login and encrypt", function() {
    this.timeout(5000);

    beforeEach(() => {
        window.localStorage.clear();
        window.location.hash = '';
    });

    it.only("Login should save access token, and session private key to local storage", function() {
        glMock.__stub('init', sinon.fake.resolves(true));
        glMock.__stub('userInfo', sinon.fake.resolves(mockUserData()));
        glMock.__stub('getAppAddresses', sinon.fake.resolves(true));

        // Set url to one with auth token
        const token = faker.random.alphaNumeric(25);
        window.location.hash = `access_token=${token}`;

        return login()
            .then(res => {
                expect(window.localStorage.getItem("access_token")).to.be.a("string");
                expect(window.localStorage.getItem("session_pk")).to.be.a("string");
            });
    });

    it('Should be able to decrypt encrypted access_token with client private key', function() {
        const token = faker.random.alphaNumeric(25);
        const clientKeys = ethcrypto.createIdentity();
        cEncryptMock.__stub("getKeys", { privateKey: clientKeys.privateKey, publicKey: clientKeys.publicKey });
        // getClientKeys();

        return setAccessToken(token)
            .then(() => {
                const cipher = window.localStorage.getItem('access_token_cipher');

                return ethcrypto.decryptWithPrivateKey(clientKeys.privateKey, JSON.parse(cipher))
            }).then(res => expect(res).to.equal(token));
    });
    
    // NOTE: This tests actually works, but logout calls location.reload(). location.reload() breaks karma
    // so this test will be skipped until a fix is found
    it.skip('Logout should delete all authentication data, and leave the client keys', function() {
        window.localStorage.setItem('client_pk', faker.random.alphaNumeric(10));
        window.localStorage.setItem('client_pubk', faker.random.alphaNumeric(10));
        window.localStorage.setItem('access_token_cipher', faker.random.alphaNumeric(10));
        window.localStorage.setItem('session_pk_cipher', faker.random.alphaNumeric(10));
        window.localStorage.setItem('session_pk', faker.random.alphaNumeric(10));
        window.localStorage.setItem('access_token', faker.random.alphaNumeric(10));

        glMock.__stub('logout', sinon.fake.resolves(true));

        return logout()
            .then(() => {
                expect(window.localStorage).to.have.keys('isLoggedIn', 'client_pk', 'client_pubk');
                expect(window.localStorage.getItem("isLoggedIn")).to.be.false;
            });
    });

    it("Encrypt data and decrypt", function() {
        glMock.__stub('login', sinon.fake.resolves(true));
        glMock.__stub('userInfo', sinon.fake.resolves(mockUserData()));

        // Set url to one with auth token
        const token = faker.random.alphaNumeric(25);
        window.location.hash = `access_token=${token}`;

        const data = faker.lorem.paragraph();

        return login()
            .then(() => encrypt(data))
            .then(res => {
                console.log("encrypted data:", res);
                return decrypt(data)
            }).then(res => {
                expect(res).to.equal(data);
            });
    });

    it("After login, 'client_keys' should be saved in local storage", function() {
        glMock.__stub('login', sinon.fake.resolves(true));
        glMock.__stub('userInfo', sinon.fake.resolves(mockUserData()));

        // Set url to one with auth token
        const token = faker.random.alphaNumeric(25);
        window.location.hash = `access_token=${token}`;

        return login()
            .then(() => {
                const pk = window.localStorage.getItem("client_pk");
                const pubk = window.localStorage.getItem("client_pubk");

                expect(pk).to.be.a('string');
                expect(pk).to.match(/^0x[\w\d]+$/);

                expect(pubk).to.be.a('string');
                expect(pubk).to.match(/^[\w\d]+$/);
            });
    });

    it("After login, localStorage should have only some properties", function() {
        this.timeout(5000);
        glMock.__stub('login', sinon.fake.resolves(true));
        glMock.__stub('userInfo', sinon.fake.resolves(mockUserData()));

        // Set url to one with auth token
        const token = faker.random.alphaNumeric(25);
        window.location.hash = `access_token=${token}`;
        window.localStorage.clear();

        console.log("ls before login", window.localStorage)

        return login()
            .then(() => {
                const ls = {...window.localStorage};
                console.log("session pk cipher:", window.localStorage.getItem("session_pk_cipher"));
                console.log("local storage:", ls);
                console.log("access otgken:", token);

                expect(ls).to.have.keys("isLoggedIn", "access_token_cipher", "session_pk_cipher", "client_pk", "client_pubk");
            });
    });
});
