import * as original from '../../../../src/components/auth/getLogin.js';
import sinon from 'sinon';

export let login = function() {
    return true;
    // return original.login();
}

export let logout = original.logout;
export let userInfo = original.userInfo;

export let getAppAddresses = original.getAppAddresses;

export function __stub(fnName, fn) {
    console.log("stubbing", fnName);
    switch(fnName) {
        case 'login':
            login = fn;
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
            login = fn;
            logout = fn;
            userInfo = fn;
            getAppAddresses = fn;
            break;
    }
}
