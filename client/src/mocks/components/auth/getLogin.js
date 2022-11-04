import * as original from '../../../../src/components/auth/getLogin.js';
import sinon from 'sinon';

export let init = function() {
    return true;
    // return original.login();
}

export let logout = original.logout;
export let userInfo = original.userInfo;
export let getAppAddresses = original.getAppAddresses;

export function __stub(fnName, fn) {
    switch(fnName) {
        case 'init':
        case 'login':
            init = fn;
            break;
        case 'logout':
            logout = fn;
            break;
        case 'userInfo':
            userInfo = fn;
            break;
        case 'getAppAddresses':
            getAppAddresses = fn;
            break;
        default:
            init = fn;
            logout = fn;
            userInfo = fn;
            getAppAddresses = fn;
            break;
    }
}
