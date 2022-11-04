import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import * as glMock from '../../../src/mocks/components/auth/getLogin.js';
import * as cEncryptMock from '../../../src/mocks/components/auth/clientEncrypt.js';
import { login, setAccessToken, getKeys } from '../../../src/components/auth/authModule.js';
import { mockUserData } from "../../helpers";

import ethcrypto from "eth-crypto";

chai.use(chaiaspromised);
const { expect } = chai;

describe.only("Authentication module: unit tests", function() {
    beforeEach(() => {
        window.localStorage.clear();
        window.location.hash = '';

        glMock.__stub('getAppAddresses', sinon.fake.resolves(true));
        glMock.__stub('login', sinon.fake.resolves(true));
        glMock.__stub('userInfo', sinon.fake.resolves(mockUserData()));
    });

    it('Login: save access token to client storage', function() {
        this.timeout(10000);
        glMock.__stub('login', sinon.fake.resolves(true));
        glMock.__stub('userInfo', sinon.fake.resolves(mockUserData()));

        const spy = sinon.fake.resolves(true);
        cEncryptMock.__stub("store", spy);

        // Set url to one with auth token
        const token = faker.random.alphaNumeric(25);
        window.location.hash = `access_token=${token}`;

        return login()
            .then(res => {
                sinon.assert.calledWith(spy, "access_token", token);
            });
    });

    it("Login: call GetLogin.getAppAddresses after access token is saved", function() {
        const token = faker.random.alphaNumeric(25);
        window.location.hash = `access_token=${token}`;

        const spy = sinon.fake.resolves({privateKey: faker.random.alphaNumeric(13),
            privateKey: faker.random.alphaNumeric(13)});

        glMock.__stub('getAppAddresses', spy);

        return login()
            .then(() => {
                sinon.assert.called(spy);
            });
    });

    it('Login: save session pk to client storage', function() {
        const keys = ethcrypto.createIdentity();
        glMock.__stub("getAppAddresses", sinon.fake.resolves(keys));

        const spy = sinon.fake.resolves(true);
        cEncryptMock.__stub("store", spy);

        // Set url to one with auth token
        const token = faker.random.alphaNumeric(25);
        window.location.hash = `access_token=${token}`;

        return login()
            .then(res => {
                sinon.assert.calledWith(spy, "session_pk", keys.privateKey);
            });
    });

    it("GetKeys should return session private key and public key", function() {
        // Save pk to local storage
        window.localStorage.setItem("session_pk", 
            '8806678cad07a0b8a40e25d0ca4be4ba0279cf640f3d2021dad4304b3ebbd21d4fccb0d2cfd3def537dc9bd94ae8746d77e739bda3d55d0b744db243909b16fd409eac9ce374a9ca7aba8bcab3c87dca3370faec7765d0b3d9ed135c7e297553ee01ebcd641ffe4186231d560c768444debe5bd5ef83ce88a1c69eada0908a813a7ef6a0c078568665d78f1e76da9f0cad4634da03f60e7a001b4462bc51bda1e9'
        );

        window.localStorage.setItem("client_pk", 
            "0x6839855c81d749765f225689cce81e27219a53f1719799b1875f657025d4d779"
        );
        window.localStorage.setItem("client_pubk", 
            "ff909117f279fa443bf5c2c8cd9fb9c0175747fb305d4b08d8a1197ecd0056565d6f2ba1a0ebce987b2ee17d7f24883b1b99ef76617828e017257f1f7aba36ed"
        );

        return getKeys()
            .then(res => {
                expect(res).to.eql({
                    privateKey: "0xa1148d1d57f2c9bb13f9430de07e6cd51efef7b39a7f56e58b09b230efb9ea95",
                    publicKey: "a6cdc66a5c43d33acf3b08b9ed0236cd0e93a070d4dbe6229ba02b536e09cee84341ac4ae0d08a056e2e8ff4ef0b00b94d2be354ce034e6c094c0b9cc9f6e2d2"
                });
            });
    });

    it('SetAccessToken should encrypt token before storing it', function() {
        // const token = faker.random.alphaNumeric(25);
        const token = "0xa1148d1d57f2c9bb13f9430de07e6cd51efef7b39a7f56e58b09b230efb9ea95";

        return setAccessToken(token)
            .then(() => {
                expect(window.localStorage.getItem('access_token')).to.be.null;

                const cipher = JSON.parse(window.localStorage.getItem('access_token_cipher'));
                expect(cipher).to.not.match(new RegExp(token, 'ig'));
                expect(cipher).to.not.equal(token);
            });
    });

    it('If encrypted token has been stored, decrypt token and call login with token', function() {
        const spy = sinon.fake.resolves(mockUserData());
        glMock.__stub("login", spy);
        glMock.__stub("userInfo", sinon.fake.resolves(mockUserData()));

        const token = "q22m7pg8y49b6igqc9vjrmvta";

        // Set client keys
        window.localStorage.setItem("client_pk", 
            "0xd5a5e2ea6d8c4def65dd919a29e59bdde66920d1c967dfc4ac49a25a89dbe767");

        window.localStorage.setItem("client_pubk",
            "6e00401e15dd25e18654382b9a02928a6ffb70c7e451b086a81a80d3cb0d947802f9bd38ea940026aa7af29e05aff77aa302c587dbfafd3902c3ab1bf55a2396");

        // Set cipher
            console.log("Stringified cipher:", ethcrypto.cipher.stringify({iv:"689e3d8fd499e0bcc0f8f4cd7fdde64d","ephemPublicKey":"04a51651d05240a0d26f0e3581fa7ee2031b9f18645ff3c365cae514dccc526d06a5df2ddaf782981ff800bf4d230e3dffa4bc69647a3bacee2df9809f05e6def2","ciphertext":"de4974120c5a49dee322fc01c988ba8e495c8ebf72efdccf1ca071907fe8fa55","mac":"3a28936e642792e2e9c7684788b504c93a297969916956442b0e6eac87d56a16"}))
        window.localStorage.setItem("access_token",
            ethcrypto.cipher.stringify({iv:"689e3d8fd499e0bcc0f8f4cd7fdde64d","ephemPublicKey":"04a51651d05240a0d26f0e3581fa7ee2031b9f18645ff3c365cae514dccc526d06a5df2ddaf782981ff800bf4d230e3dffa4bc69647a3bacee2df9809f05e6def2","ciphertext":"de4974120c5a49dee322fc01c988ba8e495c8ebf72efdccf1ca071907fe8fa55","mac":"3a28936e642792e2e9c7684788b504c93a297969916956442b0e6eac87d56a16"})
        );

        return login()
            .then(res => {
                sinon.assert.calledWith(spy, token);
            });
    });

    it('Login: throw if getlogin.login() fails', function() {
        glMock.__stub('login', sinon.fake.rejects('App currently not allowed by user'));
        glMock.__stub('userInfo', sinon.fake.resolves(mockUserData()));
        const token = faker.random.alphaNumeric(25);

        window.location.hash = `access_token=${token}`;

        return expect(login()).to.be.rejected
    });

    it('Login: do not save access token if GetLogin.login() fails', function() {
        glMock.__stub('login', sinon.fake.rejects('App currently not allowed by user'));
        glMock.__stub('userInfo', sinon.fake.resolves(mockUserData()));
        const token = faker.random.alphaNumeric(25);

        window.location.hash = `access_token=${token}`;

        return login()
            .catch(() => true)
            .then(() => {
                const storedToken = window.localStorage.getItem('access_token');
                expect(storedToken).to.be.null;
                expect( window.localStorage.getItem('session_pk')).to.be.null;
            });
    });
});
