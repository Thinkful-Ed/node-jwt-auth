const faker = require('faker');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function makeUserItems(users) {
  const items = [];

  for (let i = 0; i < users; i++) {
    for (let i = 0; i < getRandomInt(0, 5); i++) {
      const item = {
        id: 5000 + i,
        name: faker.commerce.productName,
        description: faker.lorem.paragraph(),
        user_id: users[i].id
      };
      items.push(item);
    }
  }
  return items;
}


function makeMaliciousItems(users) {
  const maliciousItems = [];
  const expectedItems = [];

  for (let i = 0; i < users; i++) {
    for (let i = 0; i < getRandomInt(0, 5); i++) {
      const malItem = {
        id: 5000 + i,
        name: '<script>alert("xss");</script>',
        description: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
        user_id: users[i].id
      };
      const okItem = {
        id: 5000 + i,
        name: '&lt;script&gt;alert("xss");&lt;/script&gt;',
        description: 'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
        user_id: users[i].id
      };
      maliciousItems.push(malItem);
      expectedItems.push(okItem);
    }
  }

  return {
    maliciousItems,
    expectedItems,
  };

}
module.exports = {
  makeUserItems,
  makeMaliciousItems,
};
