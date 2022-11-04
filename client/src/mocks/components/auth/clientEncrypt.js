import * as original from '../../../../src/components/auth/clientEncrypt.js';
import sinon from 'sinon';

export let getKeys = original.getKeys;
export let decrypt = original.decrypt;
export let encrypt = original.encrypt;
export let store = original.store;
export let retrieve = original.retrieve;

export function __stub(fnName, fn) {
    console.log("stubbing", fnName);
    switch(fnName) {
        case 'encrypt':
            encrypt = fn;
            break;
        case 'decrypt':
            decrypt = fn;
            break;
        case 'getKeys':
            getKeys = fn;
            break;
        case 'store':
            store = fn;
            break;
        case 'retrieve':
            retrieve = fn;
            break;
        default:
            encrypt = fn;
            decrypt = fn;
            getKeys = fn;
            store = fn;
            retrieve = fn;
            break;
    }
}

