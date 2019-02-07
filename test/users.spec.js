const supertest = require('supertest');
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const bcrypt = require('bcryptjs');

describe('Noteful API - Users', function () {
  const fullname = 'Test User';
  const username = 'testuser@example.com';
  const password = 'password';

  let db;

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
  });

  before('clean the table', cleanTableSet);

  afterEach('cleanup', cleanTableSet);

  after('disconnect from db', () => db.destroy());

  describe('POST /api/users', function () {
    let res;
    it('Should create a new user', function () {
      return supertest(app)
        .post('/api/users')
        .send({ fullname, username, password })
        .expect(201)
        .then(_res => {
          res = _res;
          expect(res.body.fullname).to.equal(fullname);
          expect(res.body.username).to.equal(username);
          return db('listful_users').first('*').where({ id: res.body.id });
        })
        .then(user => {
          expect(user).to.exist;
          expect(user.id).to.equal(res.body.id);
          expect(user.fullname).to.equal(fullname);
          expect(user.username).to.equal(username);
          return bcrypt.compare(password, user.password);
        })
        .then(isValid => {
          expect(isValid).to.be.true;
        });
    });

    it('Should reject users with missing username', function () {
      return supertest(app)
        .post('/api/users')
        .send({ fullname, password })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Missing fields');
        });
    });

    it('Should reject users with missing password', function () {
      return supertest(app)
        .post('/api/users')
        .send({ fullname, username })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Missing fields');
        });
    });

    it('Should reject users with non-string username', function () {
      return supertest(app)
        .post('/api/users')
        .send({ fullname, username: 12345678, password })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Incorrect field type: expected string');
        });
    });

    it('Should reject users with non-string password', function () {
      return supertest(app)
        .post('/api/users')
        .send({ fullname, username, password: 12345678 })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Incorrect field type: expected string');
        });
    });

    it('Should reject users with an invalid username address', function () {
      return supertest(app)
        .post('/api/users')
        .send({ fullname, username: ` ${username} `, password })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Cannot start or end with whitespace');
        });
    });

    it('Should reject users with non-trimmed password', function () {
      return supertest(app)
        .post('/api/users')
        .send({ fullname, username, password: ` ${password}` })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Cannot start or end with whitespace');
        });
    });

    it('Should reject users with an invalid username address', function () {
      return supertest(app)
        .post('/api/users')
        .send({ fullname, username: '', password })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Username should be a valid email address');
        });
    });

    it('Should reject users with password less than 8 characters', function () {
      return supertest(app)
        .post('/api/users')
        .send({ fullname, username, password: 'asdfghj' })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Password must a between 8 and 72 characters');
        });
    });

    it('Should reject users with password greater than 72 characters', function () {
      return supertest(app)
        .post('/api/users')
        .send({ fullname, username, password: new Array(73).fill('a').join('') })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Password must a between 8 and 72 characters');
        });
    });

  });

});
