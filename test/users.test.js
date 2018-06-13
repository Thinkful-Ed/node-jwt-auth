'use strict';

const request = require('supertest')
const { app, connectToDb, disconnectDb } = require('../server');
const { User } = require('../users');
const { TEST_DATABASE_URL } = require('../config');

describe('/api/user', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';
  const usernameB = 'exampleUserB';
  const passwordB = 'examplePassB';
  const firstNameB = 'ExampleB';
  const lastNameB = 'UserB';

  beforeAll(function () {
    return connectToDb(TEST_DATABASE_URL);
  });

  afterAll(function () {
    return disconnectDb();
  });

  beforeEach(function () { });

  afterEach(function () {
    return User.remove({});
  });

  describe('/api/users', function () {
    describe('POST', function () {
      it('Should reject users with missing username', function () {
        return request(app)
          .post('/api/users')
          .send({
            password,
            firstName,
            lastName
          })
          .then((res) => {
            expect(res.status).toEqual(422)
            expect(res.body.reason).toEqual('ValidationError');
            expect(res.body.message).toEqual('Missing field');
            expect(res.body.location).toEqual('username');
          })
      });
      it('Should reject users with missing password', function () {
        return request(app)
          .post('/api/users')
          .send({
            username,
            firstName,
            lastName
          })
          .then((res) => {
            expect(res.status).toEqual(422);
            expect(res.body.reason).toEqual('ValidationError');
            expect(res.body.message).toEqual('Missing field');
            expect(res.body.location).toEqual('password');
          });
      });
      it('Should reject users with non-string username', function () {
        return request(app)
          .post('/api/users')
          .send({
            username: 1234,
            password,
            firstName,
            lastName
          })
          .then((res) => {
            expect(res.status).toEqual(422);
            expect(res.body.reason).toEqual('ValidationError');
            expect(res.body.message).toEqual(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).toEqual('username');
          }
          )
      });
      it('Should reject users with non-string password', function () {
        return request(app)
          .post('/api/users')
          .send({
            username,
            password: 1234,
            firstName,
            lastName
          })
          .then(res => {
            expect(res.status).toEqual(422);
            expect(res.body.reason).toEqual('ValidationError');
            expect(res.body.message).toEqual(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).toEqual('password');
          });
      });
      it('Should reject users with non-string first name', function () {
        return request(app)
          .post('/api/users')
          .send({
            username,
            password,
            firstName: 1234,
            lastName
          })
          .then(res => {
            expect(res.status).toEqual(422);
            expect(res.body.reason).toEqual('ValidationError');
            expect(res.body.message).toEqual(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).toEqual('firstName');
          });
      });
      it('Should reject users with non-string last name', function () {
        return request(app)
          .post('/api/users')
          .send({
            username,
            password,
            firstName,
            lastName: 1234
          })
          .then(res => {
            expect(res.status).toEqual(422);
            expect(res.body.reason).toEqual('ValidationError');
            expect(res.body.message).toEqual(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).toEqual('lastName');
          });
      });
      it('Should reject users with non-trimmed username', function () {
        return request(app)
          .post('/api/users')
          .send({
            username: ` ${username} `,
            password,
            firstName,
            lastName
          })
          .then(res => {
            expect(res.status).toEqual(422);
            expect(res.body.reason).toEqual('ValidationError');
            expect(res.body.message).toEqual(
              'Cannot start or end with whitespace'
            );
            expect(res.body.location).toEqual('username');
          });
      });
      it('Should reject users with non-trimmed password', function () {
        return request(app)
          .post('/api/users')
          .send({
            username,
            password: ` ${password} `,
            firstName,
            lastName
          })
          .then(res => {
            expect(res.status).toEqual(422);
            expect(res.body.reason).toEqual('ValidationError');
            expect(res.body.message).toEqual(
              'Cannot start or end with whitespace'
            );
            expect(res.body.location).toEqual('password');
          });
      });
      it('Should reject users with empty username', function () {
        return request(app)
          .post('/api/users')
          .send({
            username: '',
            password,
            firstName,
            lastName
          })
          .then(res => {
            expect(res.status).toEqual(422);
            expect(res.body.reason).toEqual('ValidationError');
            expect(res.body.message).toEqual(
              'Must be at least 1 characters long'
            );
            expect(res.body.location).toEqual('username');
          });
      });
      it('Should reject users with password less than ten characters', function () {
        return request(app)
          .post('/api/users')
          .send({
            username,
            password: '123456789',
            firstName,
            lastName
          })
          .then(res => {
            expect(res.status).toEqual(422);
            expect(res.body.reason).toEqual('ValidationError');
            expect(res.body.message).toEqual(
              'Must be at least 10 characters long'
            );
            expect(res.body.location).toEqual('password');
          });
      });
      it('Should reject users with password greater than 72 characters', function () {
        return request(app)
          .post('/api/users')
          .send({
            username,
            password: new Array(73).fill('a').join(''),
            firstName,
            lastName
          })
          .then(res => {
            expect(res.status).toEqual(422);
            expect(res.body.reason).toEqual('ValidationError');
            expect(res.body.message).toEqual(
              'Must be at most 72 characters long'
            );
            expect(res.body.location).toEqual('password');
          });
      });
      it('Should reject users with duplicate username', function () {
        // Create an initial user
        return User.create({
          username,
          password,
          firstName,
          lastName
        })
          .then(() =>
            // Try to create a second user with the same username
            request(app).post('/api/users').send({
              username,
              password,
              firstName,
              lastName
            })
          )
          .then(res => {
            expect(res.status).toEqual(422);
            expect(res.body.reason).toEqual('ValidationError');
            expect(res.body.message).toEqual(
              'Username already taken'
            );
            expect(res.body.location).toEqual('username');
          });
      });
      it('Should create a new user', function () {
        return request(app)
          .post('/api/users')
          .send({
            username,
            password,
            firstName,
            lastName
          })
          .then(res => {
            expect(res.status).toEqual(201);
            expect(res.body).toEqual(expect.any(Object));
            expect(res.body).toHaveProperty('username', username);
            expect(res.body).toHaveProperty('firstName', firstName);
            expect(res.body).toHaveProperty('lastName', lastName);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).not.toBeNull();
            expect(user.firstName).toEqual(firstName);
            expect(user.lastName).toEqual(lastName);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).toBeTruthy();
          });
      });
      it('Should trim firstName and lastName', function () {
        return request(app)
          .post('/api/users')
          .send({
            username,
            password,
            firstName: ` ${firstName} `,
            lastName: ` ${lastName} `
          })
          .then(res => {
            expect(res.status).toEqual(201);
            expect(res.body).toEqual(expect.any(Object));
            expect(res.body).toHaveProperty('username', username)
            expect(res.body).toHaveProperty('firstName', firstName)
            expect(res.body).toHaveProperty('lastName', lastName)
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).not.toBeNull();
            expect(user.firstName).toEqual(firstName);
            expect(user.lastName).toEqual(lastName);
          });
      });
    });

    describe('GET', function () {
      it('Should return an empty array initially', function () {
        return request(app).get('/api/users').then(res => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual(expect.any(Array));
          expect(res.body).toHaveLength(0)
        });
      });
      it('Should return an array of users', function () {
        return User.create(
          {
            username,
            password,
            firstName,
            lastName
          },
          {
            username: usernameB,
            password: passwordB,
            firstName: firstNameB,
            lastName: lastNameB
          }
        )
          .then(() => request(app).get('/api/users'))
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body).toEqual(expect.any(Array));
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).toEqual({
              username,
              firstName,
              lastName
            });
            expect(res.body[1]).toEqual({
              username: usernameB,
              firstName: firstNameB,
              lastName: lastNameB
            });
          });
      });
    });
  });
});
