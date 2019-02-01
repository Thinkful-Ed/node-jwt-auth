/* global supertest */

const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { signToken } = require('../src/helpers/jwt-helper');
const { makeUsersArray } = require('./users.fixtures');
const { makeArticlesArray, makeMaliciousArticle } = require('./articles.fixtures');
const secret = process.env.JWT_SECRET;
const expiry = require('../src/config').JWT_EXPIRY;

describe('Articles Endpoints', function () {
  let db, token;

  const cleanTableSet = () => {
    return db('blogful_articles').del()
      .then(() => {
        return db('blogful_users').del();
      });
  };

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
    token = signToken({
      username: '123'
    }, secret, expiry);
  });

  before('clean the table', cleanTableSet);

  afterEach('cleanup', cleanTableSet);

  after('disconnect from db', () => db.destroy());

  describe('GET /api/articles', () => {
    context('Given no articles', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/articles')
          .set('Authorization', `Bearer ${token}`)
          .expect(200, []);
      });
    });

    context('Given there are articles in the database', () => {
      const testArticles = makeArticlesArray();
      const testUsers = makeUsersArray();

      beforeEach('insert articles', () => {
        return db
          .into('blogful_users')
          .insert(testUsers)
          .then(() => db
            .into('blogful_articles')
            .insert(testArticles));
      });

      it('responds with 200 and all of the articles', () => {
        return supertest(app)
          .get('/api/articles')
          .set('Authorization', `Bearer ${token}`)
          .expect(200, testArticles);
      });
    });

    context('Given an XSS attack article', () => {
      const { maliciousArticle, expectedArticle } = makeMaliciousArticle();

      beforeEach('insert malicious article', () => {
        return db
          .into('blogful_articles')
          .insert([maliciousArticle]);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/api/articles')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedArticle.title);
            expect(res.body[0].content).to.eql(expectedArticle.content);
          });
      });
    });
  });

  describe('GET /api/articles/:article_id', () => {
    context('Given no articles', () => {
      it('responds with 404', () => {
        const articleId = 123456;
        return supertest(app)
          .get(`/api/articles/${articleId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(404, { error: { message: 'Article doesn\'t exist' } });
      });
    });

    context('Given there are articles in the database', () => {
      const testArticles = makeArticlesArray();
      const testUsers = makeUsersArray();

      beforeEach('insert articles', () => {
        return db
          .into('blogful_users')
          .insert(testUsers)
          .then(() => db
            .into('blogful_articles')
            .insert(testArticles));
      });

      it('responds with 200 and the specified article', () => {
        const articleId = 2;
        const expectedArticle = testArticles[articleId - 1];
        return supertest(app)
          .get(`/api/articles/${articleId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200, expectedArticle);
      });
    });

    context('Given an XSS attack article', () => {
      const { maliciousArticle, expectedArticle } = makeMaliciousArticle();

      beforeEach('insert malicious article', () => {
        return db
          .into('blogful_articles')
          .insert([maliciousArticle]);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/articles/${maliciousArticle.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedArticle.title);
            expect(res.body.content).to.eql(expectedArticle.content);
          });
      });
    });
  });

  /**
   *
   *
   * OTHER TESTS HERE
   *
   */

});
