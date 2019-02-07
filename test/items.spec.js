const knex = require('knex');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const { expect } = require('chai');

const app = require('../src/app');
const { makeUsers } = require('./users.fixtures');
const { makeUserItems, makeMaliciousItem } = require('./items.fixtures');
const { JWT_EXPIRY, JWT_SECRET } = require('../src/config');

describe('Items Endpoints', function () {
  let db;
  const users = makeUsers(2);

  const user = users[0]; // user with items

  const userFooItems = makeUserItems(user);
  const { maliciousItem, expectedItem } = makeMaliciousItem(user);

  const token = jwt.sign({ user: user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  beforeEach('seed users', () => {
    return db
      .insert(users)
      .into('listful_users');
  });

  afterEach('cleanup', () => {
    return db('listful_items').del()
      .then(() => db('listful_users').del());
  });

  after('disconnect', () => db.destroy());

  describe('GET /api/items', () => {

    context('Given no items and no authorization JWT', () => {

      it('responds with 401', () => {
        return supertest(app)
          .get('/api/items')
          .expect(401)
          .expect(res => {
            expect(res.body.error.message).to.eql("No 'Authorization' header found");
          });
      });

    });

    context('Given no items with valid authorization JWT', () => {

      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/items')
          .set('Authorization', `Bearer ${token}`)
          .expect(200, []);
      });

    });

    context('Given items belonging to authorized user', () => {

      beforeEach('seed items', () => {
        return db
          .insert(userFooItems)
          .into('listful_items');
      });

      it('responds with 200 and all of the items', () => {
        return supertest(app)
          .get('/api/items')
          .set('Authorization', `Bearer ${token}`)
          .expect(200, userFooItems);
      });

    });

    context('Given an XSS compromised item', () => {

      beforeEach('insert users and malicious items', () => {
        return db
          .insert(maliciousItem)
          .into('listful_items');
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/api/items')
          .set('Authorization', `Bearer ${token}`)
          .expect(200, [expectedItem]);
      });
    });


  });

  describe('GET /api/items/:item_id', () => {

    const badItemId = 123456;

    context('Given no items and no authorization JWT', () => {
      it('responds with 401', () => {
        return supertest(app)
          .get(`/api/items/${badItemId}`)
          .expect(401)
          .expect(res => {
            expect(res.body.error.message).to.eql("No 'Authorization' header found");
          });
      });
    });

    context('Given no items with valid authorization JWT', () => {
      it('responds with 404', () => {
        return supertest(app)
          .get(`/api/items/${badItemId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(res => {
            expect(res.body.error.message).to.eql('Item does not exist');
          });
      });
    });

    context('Given items belonging to authorized user', () => {
      beforeEach('insert items', () => {
        return db
          .insert(userFooItems)
          .into('listful_items');
      });

      it('responds with 200 and the specified item', () => {
        const item = userFooItems[0];
        return supertest(app)
          .get(`/api/items/${item.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200, item);
      });
    });

    context('Given an XSS attack article', () => {

      beforeEach('insert users and malicious items', () => {
        return db
          .insert(maliciousItem)
          .into('listful_items');
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/items/${maliciousItem.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200, expectedItem);
      });
    });
  });

});
