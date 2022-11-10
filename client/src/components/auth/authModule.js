import * as gl from "@auth/getLogin.js";
import ethcrypto from "eth-crypto";
import { wipeIdb } from "../../utils/index";

import { store as storeToClient, retrieve as retrieveFromClient } from "@auth/clientEncrypt.js";

export function getAuthUrl() {
  const currentUri = window.location.origin;
  const appID = process.env.REACT_APP_GL_APP_ID;

  return `https://getlogin.org/xauthorize?client_id=${appID}&response_type=id_token&redirect_uri=${currentUri}`;
}

export function setUserID(userID) {
  localStorage.setItem("user_id", userID);
}

function unsetAccessToken() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("session_pk");
}

/**
 * Returns Public, Private key and Address received from GetLogin
 * These keys are encrypted and decrypted using the client keys.
 */
export function getKeys() {
  return retrieveFromClient("session_pk").then((res) => {
    if (res) {
      const privateKey = res;
      const publicKey = ethcrypto.publicKeyByPrivateKey(privateKey);

      return {
        privateKey,
        publicKey,
      };
    } else return null;
  });
}

export function getAccessToken() {
  return retrieveFromClient("access_token");
}

/**
 * Encrypt access token and save to localStorage
 */
export function setAccessToken(token: String) {
  return storeToClient("access_token", token);
}

export function setSessionPK(privateKey: String) {
  return storeToClient("session_pk", privateKey);
}

export function login() {
  const params = new URLSearchParams(window.location.hash.replace("#", "?"));
  // const userID = params.get("user_id");

  return (() => {
    if (params.get("access_token")) {
      const tk = params.get("access_token");
      console.log("setting access token");

      return setAccessToken(tk).then(() => tk);
    } else return getAccessToken();
  })()
    .then((accessToken) => {
      console.log("Logging in with access token ", accessToken);
      if (accessToken) {
        return gl.init(accessToken).then((res) => {
          console.log("init done");
          if (res) {
            return wipeIdb()
              .then(() => gl.getAppAddresses())
              .then(({ privateKey }) => setSessionPK(privateKey))
              .then(() => {
                console.log("LOGIN DONE");
                isLoggedIn(true);
                return gl.userInfo();
              });
          } else return false;
        });
      } else return false;
    })
    .catch((e) => {
      console.log("error logging in", e);
      isLoggedIn(false);
      throw e;
    });
}

/**
 * This function will encrypt any data passed to it, using the
 * GetLogin.eth user session keys.
 * @param {any} data  Data to be encrypted
 */
export function encrypt(data) {
  return login()
    .then(() => getKeys())
    .then((res) => {
      const { publicKey } = res;
      return ethcrypto.encryptWithPublicKey(publicKey, data);
    })
    .then((cipher) => ethcrypto.cipher.stringify(cipher));
}

/**
 * This function will decrypt any data passed to it, using the
 * GetLogin.eth user session keys.
 * @param {String} data  Data to be decrypted.
 */
export function decrypt(data) {
  if (!data) throw new Error("No data");

  if (typeof data != "object") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.log("Data is not JSON");
    }

    if (typeof data != "object") {
      data = ethcrypto.cipher.parse(data);
    }
  }

  console.log("LOGIN");
  return login()
    .then(() => {
      console.log("FINISHED LOGIN");
      return ethcrypto.cipher.parse(data);
    })
    .then((encryptObj) => {
      if (!encryptObj.ciphertext) return encryptObj;

      return getKeys().then(({ privateKey }) => {
        if (privateKey) return ethcrypto.decryptWithPrivateKey(privateKey, encryptObj);
        else return false;
      });
    });
}

export function isLoggedIn(val = null) {
  if (val === null) {
    const isLoggedInVal = window.localStorage.getItem("isLoggedIn");

    if (isLoggedInVal === "true") return true;
    else return false;
  } else {
    let storageVal = window.localStorage.setItem("isLoggedIn", val);
    if (storageVal === "true") return true;
    else return false;
  }
}

export function logout() {
  window.localStorage.clear();

  return gl
    .logout()
    .then(() => {
      isLoggedIn(false);
      unsetAccessToken();
      return wipeIdb();
    })
    .then(() => {
      window.location.reload();
    });
}
