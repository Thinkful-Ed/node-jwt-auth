/* global supertest */

const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const bcrypt = require('bcryptjs');

describe('Noteful API - Users', function () {
  const first_name = 'Test';
  const last_name = 'User';
  const screen_name = 'Test User';
  const email = 'testuser@example.com';
  const password = 'password';

  let db;

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
  });

  before('clean the table', cleanTableSet);

  afterEach('cleanup', cleanTableSet);

  after('disconnect from db', () => db.destroy());

  describe('POST /api/users', function () {
    let res;
    it('Should create a new user', function () {
      return supertest(app)
        .post('/api/users')
        .send({ first_name, last_name, screen_name, email, password })
        .expect(201)
        .then(_res => {
          res = _res;
          expect(res.body.first_name).to.equal(first_name);
          expect(res.body.last_name).to.equal(last_name);
          expect(res.body.screen_name).to.equal(screen_name);
          expect(res.body.email).to.equal(email);
          return db('blogful_users').first('*').where({ id: res.body.id });
        })
        .then(user => {
          expect(user).to.exist;
          expect(user.id).to.equal(res.body.id);
          expect(user.first_name).to.equal(first_name);
          expect(user.last_name).to.equal(last_name);
          expect(user.screen_name).to.equal(screen_name);
          expect(user.email).to.equal(email);
          return bcrypt.compare(password, user.password);
        })
        .then(isValid => {
          expect(isValid).to.be.true;
        });
    });

    it('Should reject users with missing username', function () {
      return supertest(app)
        .post('/api/users')
        .send({ first_name, last_name, screen_name, password })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Missing fields');
        });
    });

    it('Should reject users with missing password', function () {
      return supertest(app)
        .post('/api/users')
        .send({ first_name, last_name, screen_name, email })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Missing fields');
        });
    });

    it('Should reject users with non-string username', function () {
      return supertest(app)
        .post('/api/users')
        .send({ first_name, last_name, screen_name, email: 123456, password })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Incorrect field type: expected string');
        });
    });

    it('Should reject users with non-string password', function () {
      return supertest(app)
        .post('/api/users')
        .send({ first_name, last_name, screen_name, email, password: 123456 })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Incorrect field type: expected string');
        });
    });

    it('Should reject users with an invalid email address', function () {
      return supertest(app)
        .post('/api/users')
        .send({ first_name, last_name, screen_name, email: ` ${email} `, password })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Please provide a valid email address');
        });
    });

    it('Should reject users with non-trimmed password', function () {
      return supertest(app)
        .post('/api/users')
        .send({ first_name, last_name, screen_name, email, password: ` ${password}` })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Cannot start or end with whitespace');
        });
    });

    it('Should reject users with an invalid email address', function () {
      return supertest(app)
        .post('/api/users')
        .send({ first_name, last_name, screen_name, email: '', password })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Please provide a valid email address');
        });
    });

    it('Should reject users with password less than 8 characters', function () {
      return supertest(app)
        .post('/api/users')
        .send({ first_name, last_name, screen_name, email, password: 'asdfghj' })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Password must a between 8 and 72 characters');
        });
    });

    it('Should reject users with password greater than 72 characters', function () {
      return supertest(app)
        .post('/api/users')
        .send({ first_name, last_name, screen_name, email, password: new Array(73).fill('a').join('') })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Password must a between 8 and 72 characters');
        });
    });

    it('Should reject users with duplicate username');

    it('Should trim fullname');

  });

});
