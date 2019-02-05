/* global supertest */

const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { signToken } = require('../src/helpers/jwt-helper');
const { makeUsers } = require('./users.fixtures');
const { makeUserItems, makeMaliciousItems } = require('./items.fixtures');
const secret = process.env.JWT_SECRET;
const expiry = require('../src/config').JWT_EXPIRY;

describe('Items Endpoints', function () {
  let db, token;

  const cleanTableSet = () => {
    return db('listful_items').del()
      .then(() => {
        return db('listful_users').del();
      });
  };

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);

    token = signToken({
      username: 'test'
    }, secret, expiry);
  });

  before('clean the table', cleanTableSet);

  afterEach('cleanup', cleanTableSet);

  after('disconnect from db', () => db.destroy());

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
      const testUsers = makeUsers();
      const testItems = makeUserItems(testUsers);

      beforeEach('insert users and items', () => {
        return db
          .into('listful_users')
          .insert(testUsers)
          .then(() => db
            .into('listful_items')
            .insert(testItems));
      });

      it('responds with 200 and all of the items', () => {
        return supertest(app)
          .get('/api/items')
          .set('Authorization', `Bearer ${token}`)
          .expect(200, testItems);
      });
    });

    context('Given an XSS compromised item', () => {
      const testUsers = makeUsers();
      const { maliciousItems, expectedItems } = makeMaliciousItems();

      beforeEach('insert users and malicious items', () => {
        return db
          .into('listful_users')
          .insert(testUsers)
          .then(() => db
            .into('listful_items')
            .insert(maliciousItems));
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/api/items')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedItems[0].name);
            expect(res.body[0].description).to.eql(expectedItems[0].description);
          });
      });
    });
  });

  describe('GET /api/items/:item_id', () => {

    const badItemId = 123456;

    context('Given no items and no authorization JWT', () => {
      it('responds with 401', () => {
        return supertest(app)
          .get(`/api/items/${badItemId}`)
          .expect(401, '');
      });
    });

    context('Given no items with valid authorization JWT', () => {
      it('responds with 404', () => {
        return supertest(app)
          .get(`/api/items/${badItemId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(404, { error: { message: 'Item does not exist' } });
      });
    });

    context('Given items belonging to authorized user', () => {
      const testUsers = makeUsers();
      const testItems = makeUserItems(testUsers);

      beforeEach('insert items', () => {
        return db
          .into('listful_users')
          .insert(testUsers)
          .then(() => db
            .into('listful_items')
            .insert(testItems));
      });

      it('responds with 200 and the specified item', () => {
        const articleId = 2;
        const expectedArticle = testItems[articleId - 1];
        return supertest(app)
          .get(`/api/items/${articleId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200, expectedArticle);
      });
    });

    context('Given an XSS attack article', () => {
      const testUsers = makeUsers();
      const { maliciousItems, expectedItems } = makeMaliciousItems();

      beforeEach('insert users and malicious items', () => {
        return db
          .into('listful_users')
          .insert(testUsers)
          .then(() => db
            .into('listful_items')
            .insert(maliciousItems));
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/items/${maliciousItems[0].id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedItems[0].name);
            expect(res.body[0].description).to.eql(expectedItems[0].description);
          });
      });
    });
  });

});
