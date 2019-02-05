const faker = require('faker');

const PASSWORD = 'P@ssw0rd!';

function makeUsers(num = 5) {
  let USER_INDEX = 1;
  const users = [];
  for (let i = 0; i < num; i++) {
    const user = {
      id: 1000 + i,
      fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
      username: `${faker.internet.userName()}__${USER_INDEX}`,
      password: PASSWORD
    };
    users.push(user);
  }

  return users;
}

module.exports = { makeUsers };
