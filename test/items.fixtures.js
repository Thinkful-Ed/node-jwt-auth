const faker = require('faker');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function makeUserItems(user) {
  const items = [];

  for (let i = 0; i < getRandomInt(3, 5); i++) {
    const dt = new Date();
    const item = {
      id: 5000 + i,
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      created_at: dt.toISOString(),
      user_id: user.id
    };
    items.push(item);
  }

  return items;
}


function makeMaliciousItem(user) {
  const dt = new Date();
  const created_at = dt.toISOString();
  const maliciousItem = {
    id: 911,
    name: '<script>alert("xss");</script>',
    description: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
    created_at: created_at,
    user_id: user.id



  };
  const expectedItem = {
    id: 911,
    name: '&lt;script&gt;alert("xss");&lt;/script&gt;',
    description: 'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
    created_at: created_at,
    user_id: user.id
  };

  return {
    maliciousItem,
    expectedItem,
  };

}
module.exports = {
  makeUserItems,
  makeMaliciousItem,
};
