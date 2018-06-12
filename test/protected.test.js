'use strict';

const jwt = require('jsonwebtoken');
const request = require('supertest');

const { app, connectToDb, disconnectDb } = require('../server');
const { User } = require('../users');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');


// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http

describe('Protected endpoint', function () {
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


  describe('/api/protected', function () {
    it('Should reject requests with no credentials', function () {
      return request(app)
        .get('/api/protected')
        .expect(401);
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
        .get('/api/protected')
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
          exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username
        }
      );

      return request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
    });
    it('Should send protected data', function () {
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

      return request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.data).toEqual('rosebud');
        });
    });
  });
});
