import ethcrypto from "eth-crypto";

/**
 * This module handles encrypted storage and decryption to
 * the user's client (browser). It should not be used to encrypt data
 * that will be stored to any ephemeral sources (eg Swarm, server)
 * It is meant to keep client data secure
 */

/**
 * Creates keys and stores them in client. These keys are
 * only ever used to encrypt the keys and token received
 * from GetLogin.eth
 */
function createClientKeys() {
  const keys = ethcrypto.createIdentity();

  localStorage.setItem("client_pk", keys.privateKey);
  localStorage.setItem("client_pubk", keys.publicKey);

  return keys;
}

/**
 * Returns keys created in client that are used to encrypt
 * GetLogin keys. These keys are only used to encrypt keys
 * and tokens received from GetLogin.eth
 */
export function getKeys() {
  const pk = localStorage.getItem("client_pk");
  const pubk = localStorage.getItem("client_pubk");

  const keys =
    pk && pubk && typeof pk == "string" && typeof pubk == "string"
      ? { publicKey: pubk, privateKey: pk }
      : createClientKeys();

  return keys;
}

/**
 * This function will encrypt any data passed to it, using the
 * GetLogin.eth user session keys.
 * @param {any} data  Data to be encrypted
 */
export function encrypt(data) {
  const keys = getKeys();
  const {publicKey} = keys;
  // const {publicKey} = getKeys();

  return ethcrypto.encryptWithPublicKey(publicKey, data)
    .then((cipher) => ethcrypto.cipher.stringify(cipher));
}

/**
 * This function will decrypt any data passed to it using the
 * client keys stored on the current browser.
 * It is only to be used for securing authentication data that will
 * live only on the current browser.
 * It should not be used to encrypt long data that will be stored on
 * the server like bundle archives, or account data
 */
export function decrypt(data) {
  const { privateKey } = getKeys();

  if (data && typeof data == "string") {
    const encryptObj = ethcrypto.cipher.parse(data);

    if (!encryptObj.ciphertext) return encryptObj;

    const { privateKey } =  getKeys();

    if (privateKey) return ethcrypto.decryptWithPrivateKey(privateKey, encryptObj);
    else return Promise.resolve(false);

  } else return Promise.reject(new Error("Bad cipher"));
}

/**
 * This function will encrypt whatever data is passed to it and then store it in LocalStorage
 * @param {String} name - Name of the data
 * @param {any} data - The data that will be stored
 */
export function store(name: String, data) {
  if(typeof data == 'object')
    data = JSON.stringify(data);

  return encrypt(data)
    .then(res => {
      window.localStorage.setItem(name, res)

      return true;
    });
}

export function retrieve(name: String) {
  const cipher = window.localStorage.getItem(name);

  if(!cipher)
    return Promise.resolve(null);

  else
    return decrypt(cipher);
}
