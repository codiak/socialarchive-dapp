import { faker } from '@faker-js/faker';

export function mockUserData() {
  return {
    username: faker.internet.userName(),
    usernameHash: '0x' + faker.random.alphaNumeric(64)
  }
}



