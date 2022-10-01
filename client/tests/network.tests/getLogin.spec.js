import sinon from 'sinon';
import { faker } from '@faker-js/faker';
import chai from 'chai';
import chaiaspromised from 'chai-as-promised';
import { login, setAccessToken } from '../../src/components/auth/authModule.js';

chai.use(chaiaspromised);
const { expect } = chai;

