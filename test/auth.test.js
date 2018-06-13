'use strict';

const jwt = require('jsonwebtoken');

const request = require('supertest')
const { app, connectToDb, disconnectDb } = require('../server');
const { User } = require('../users');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http

describe('Auth endpoints', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';

  beforeAll(function () {
    return connectToDb(TEST_DATABASE_URL);
  });

  afterAll(function () {
    return disconnectDb();
  });

  beforeEach(function () {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password,
        firstName,
        lastName
      })
    );
  });

  afterEach(function () {
    return User.remove({});
  });

  describe('/api/auth/login', function () {
    it('Should reject requests with no credentials', function () {
      return request(app)
        .post('/api/auth/login')
        .expect(400)
    });
    it('Should reject requests with incorrect usernames', function () {
      return request(app)
        .post('/api/auth/login')
        .send({ username: 'wrongUsername', password })
        .expect(401)
    });
    it('Should reject requests with incorrect passwords', function () {
      return request(app)
        .post('/api/auth/login')
        .send({ username, password: 'wrongPassword' })
        .expect(401)
    });
    it('Should return a valid auth token', function () {
      return request(app)
        .post('/api/auth/login')
        .send({ username, password })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual(expect.any(Object));
          const token = res.body.authToken;
          expect(token).toEqual(expect.any(String));
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user).toEqual({
            username,
            firstName,
            lastName
          });
        });
    });
  });

  describe('/api/auth/refresh', function () {
    it('Should reject requests with no credentials', function () {
      return request(app)
        .post('/api/auth/refresh')
        expect(401)
    });
    it('Should reject requests with an invalid token', function () {
      const token = jwt.sign(
        {
          username,
          firstName,
          lastName
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );

      return request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
    });
    it('Should reject requests with an expired token', function () {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          },
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
        }
      );

      return request(app)
        .post('/api/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        expect(401)
    });
    it('Should return a valid auth token with a newer expiry date', function () {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );
      const decoded = jwt.decode(token);

      return request(app)
        .post('/api/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual(expect.any(Object));
          const token = res.body.authToken;
          expect(token).toEqual(expect.any(String));
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user).toEqual({
            username,
            firstName,
            lastName
          });
          expect(payload.exp).toBeGreaterThanOrEqual(decoded.exp);
        });
    });
  });
});
