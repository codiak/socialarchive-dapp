import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import { getKeys, store, retrieve } from '../../../src/components/auth/clientEncrypt.js';
import { mockUserData } from "../../helpers";

import ethcrypto from "eth-crypto";

chai.use(chaiaspromised);
const { expect } = chai;

describe("Client Encryption  module: unit tests", function() {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
  });

  it("GetKeys should return client private key and public key", function() {
    const privateKey = "0x90c91c822f6aee102535eaff6e39bb8e6a691864a98eaf50aa62fc05c5515043",
      publicKey = "50136fdc2720064053eb7d1b4f3a36c7ea1c9cfb053829fcb9f631da2b8349726f296373c1eb1cd3f24371b98d1767051ca699c55778201b6330462219074365";

    window.localStorage.setItem("client_pk", 
      privateKey
    );
    window.localStorage.setItem("client_pubk", 
      publicKey
    );

    expect(getKeys()).to.eql({privateKey, publicKey});
  });

  it('Store() should encrypt data before storing it', function() {
    // const token = faker.random.alphaNumeric(25);
    const data = "0xa1148d1d57f2c9bb13f9430de07e6cd51efef7b39a7f56e58b09b230efb9ea95";

    return store('token', data)
      .then(() => {
        const storedData = window.localStorage.getItem('token');
        expect(storedData).to.not.eql(data);
      });
  });

  it('One should be able to decrypt stored data with client private key', function() {
    const token = faker.random.alphaNumeric(25);
    const clientKeys = getKeys();

    return store('access_token', token)
      .then(() => {
        const cipher = window.localStorage.getItem('access_token');

        return ethcrypto.decryptWithPrivateKey(clientKeys.privateKey, cipher)
      }).then(res => expect(res).to.equal(token));
  });

  it('Retrieve() should return stored client data', function() {
    const token = "zm2pvgq6ggu80zwlbr8w69iic";

    const cipher = "397f9ac31613cee1bc8b4fa8bca9bcac02458f0179cd8f170a88fc449c6ee3c5d4945417002ab6c72dcac42ffa10485b91c8b0b9789bdd3173b04fe02035cd6d3051f358344b2f70d291829ed72d782e33f9cd54bb5c3421f7d22c6fb34cb58ddddcf450b75ad50113d24d2579e3815b03";
    window.localStorage.setItem("access_token", cipher);

    window.localStorage.setItem("client_pk", "0x32238000e8507ade87e0a5ee1a7a97df4c177f3d3619d4adce36871091222c19");
    window.localStorage.setItem("client_pubk", "61f04772efc340fa2fb68af70e2fd2b75b3e403a5d367953b070afdb83605b6e2632edf465c47443a704dd5437553857172dcb23a8aa832b93ed75a5cfa98a3e");

    window.localStorage.getItem("client_pk");

    return retrieve("access_token")
      .then(res => expect(res).to.equal(token));
  });
});
