import * as gl from "@auth/getLogin.js";
import ethcrypto from "eth-crypto";
import { wipeIdb } from "../../utils/index";

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
}

export function getKeys() {
  let pk = localStorage.getItem("session_pk"),
    keys = {};

  if (pk && pk.trim() !== "" && typeof pk == "string") {
    keys.privateKey = pk;
    keys.publicKey = ethcrypto.publicKeyByPrivateKey(pk);
    keys.address = ethcrypto.publicKey.toAddress(keys.publicKey);
  } else {
    localStorage.removeItem("session_pk");
    keys = ethcrypto.createIdentity();
  }
  // return gl.getAppAddresses()
  return Promise.resolve(keys);
}

/**
 * Encrypt access token and save to localStorage
 */
export function getAccessToken() {
  const key = localStorage.getItem("session_pk");
  const encryptedText = localStorage.getItem("access_token");

  if (key && encryptedText) {
    return ethcrypto.decryptWithPrivateKey(key, JSON.parse(encryptedText));
  } else return Promise.resolve(false);
}

export function setAccessToken(token: String) {
  console.log("setting access token", token);
  // let encryptedToken = ethcrypto.encryptWithPublicKey(token);

  return getKeys()
    .then((appAddresses) => {
      const key = appAddresses.publicKey;
      localStorage.setItem("session_pk", appAddresses.privateKey);
      return ethcrypto.encryptWithPublicKey(key, token);
    })
    .then((res) => {
      // const encryptedToken = res.ciphertext;

      localStorage.setItem("access_token", JSON.stringify(res));
    });
}

export function login() {
  const params = new URLSearchParams(window.location.hash.replace("#", "?"));
  // const userID = params.get("user_id");

  return (() => {
    if (params.get("access_token")) {
      return Promise.resolve(params.get("access_token"));
    } else return getAccessToken();
  })().then((accessToken) => {
    console.log("Logging in with access token ", accessToken);
    if (accessToken) {
      return gl.init(accessToken).then((res) => {
        if (res) {
          return (() => {
            if (params.get("access_token")) {
              return setAccessToken(params.get("access_token"));
            } else return Promise.resolve(true);
          })()
            .then(() => wipeIdb())
            .then(() => {
              console.log("LOGIN DONE");
              isLoggedIn(true);
              return gl.userInfo();
            });
        } else return false;
      });
    }
  });
}

export function encrypt(data) {
  return login()
    .then(() => getKeys())
    .then((res) => {
      const { publicKey } = res;
      return ethcrypto.encryptWithPublicKey(publicKey, data);
    })
    .then((cipher) => ethcrypto.cipher.stringify(cipher));
}

export function decrypt(data) {
  if (data && typeof data == "string") {
    console.log("DECRYPT");
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
  } else return Promise.resolve(data);
}

export function isLoggedIn(val = null) {
  if (val === null) return window.localStorage.getItem("isLoggedIn");
  else window.localStorage.setItem("isLoggedIn", val);
}

export function logout() {
  return gl
    .logout()
    .then(() => {
      unsetAccessToken();
      return wipeIdb();
    })
    .then(() => {
      window.location.reload();
    });
}
