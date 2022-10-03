import 'https://getlogin.org/api/last.js';
import ethcrypto from 'eth-crypto';

const glInstance = new window._getLoginApi();
let timers = {};

export function init(accessToken) {
    const APP_ID = process.env.REACT_APP_GL_APP_ID;

    console.log("gl instance:", glInstance);
    console.log("is gl instance ready?", glInstance.isReady())
    console.log("is gl initing?:", glInstance.isInitInProgress);

    if(glInstance.isReady()) 
        return Promise.resolve(true)
    else if(glInstance.isInitInProgress) {
        console.log("INIT IN PROGRESS");
        let maxWaitTime = 6000 // in ms;

        return new Promise((resolve, reject) => {
            const timerId = "timer" + Object.keys(timers).length;

            timers[timerId] = setInterval(() => {
                console.log('new timer', timerId);
                maxWaitTime = maxWaitTime - 500;
                if(glInstance.isReady()) {
                    console.log('TIMER CANCELLED');
                    clearInterval(timers[timerId]);
                    return resolve(true);
                } else if(maxWaitTime < 500) {
                    clearInterval(timers[timerId]);
                    console.log('TIMER DONE. FAILING');
                    return reject(false);
                } else {
                    console.log("instance is not ready, and we still have time");
                }
            }, 500)
        });
    }
    else if(!glInstance.isInitInProgress) {
        return glInstance.init(APP_ID, 'https://getlogin.org/', window.location.origin, accessToken)
            .then(res => {
                if (res.data.is_client_allowed) {
                    return true;
                } else {
                    throw new Error('App currently not allowed by user');
                }
            });
    } else return false;
}

export function logout() {
    return glInstance.logout();
}

export function userInfo() {
    return glInstance.getUserInfo();
}

export function getAppAddresses() {
    return glInstance.getSessionPrivateKey()
        .then(res => {
            const privateKey = res;
            const publicKey = ethcrypto.publicKeyByPrivateKey(privateKey);

            return {
                privateKey, publicKey,
            };
        });
}

export default {
    init
}
