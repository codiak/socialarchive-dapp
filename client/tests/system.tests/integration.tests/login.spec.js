import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import * as glMock from '../../../src/mocks/components/auth/getLogin.js';
import * as cEncryptMock from '../../../src/mocks/components/auth/clientEncrypt.js';
import { login, logout, encrypt, decrypt, setAccessToken, getAccessToken } from '../../../src/components/auth/authModule.js';

import ethcrypto from "eth-crypto";

import { mockUserData } from "../../helpers";

chai.use(chaiaspromised);
const { expect } = chai;

describe("Login and encrypt", function() {
    this.timeout(5000);

    beforeEach(() => {
        window.localStorage.clear();
        window.location.hash = '';

        glMock.__stub('login', sinon.fake.resolves(true));
        glMock.__stub('userInfo', sinon.fake.resolves(mockUserData()));
        glMock.__stub('getAppAddresses', sinon.fake.resolves(ethcrypto.createIdentity()));
    });

    it("Login should save access token, and session private key to local storage", function() {
        glMock.__stub('getAppAddresses', sinon.fake.resolves(ethcrypto.createIdentity()));

        // Set url to one with auth token
        const token = faker.random.alphaNumeric(25);
        window.location.hash = `access_token=${token}`;

        return login()
            .then(res => {
                expect(window.localStorage.getItem("access_token")).to.be.a("string");
                expect(window.localStorage.getItem("session_pk")).to.be.a("string");
            });
    });

    it('Should be able to set and retrieve access token', function() {
        const token = faker.random.alphaNumeric(25);

        return setAccessToken(token)
            .then(() => {
                return getAccessToken()
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
        // Set url to one with auth token
        const token = faker.random.alphaNumeric(25);
        window.location.hash = `access_token=${token}`;

        const data = faker.lorem.paragraph();

        return login()
            .then(() => encrypt(data))
            .then(cipherString => {
                return decrypt(cipherString)
            }).then(res => {
                expect(res).to.equal(data);
            });
    });

    it("After login, 'session_pk' and 'access_token' should be saved in local storage", function() {
        const token = faker.random.alphaNumeric(25);
        window.location.hash = `access_token=${token}`;
        window.localStorage.clear();

        expect(window.localStorage.getItem("session_pk")).to.null;
        expect(window.localStorage.getItem("access_token")).to.null;

        return login()
            .then(() => {
                expect(window.localStorage.getItem("session_pk")).to.be.a("string");
                expect(window.localStorage.getItem("access_token")).to.be.a("string");
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

                expect(ls).to.have.keys("isLoggedIn", "access_token", "session_pk", "client_pk", "client_pubk");
            });
    });
});
