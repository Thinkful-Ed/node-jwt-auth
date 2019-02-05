var validator = require('validator');
const createError = require('http-errors');
const UserService = require('./users-service');

exports.validateUser = (req, res, next) => {
  const { username, password } = req.body;
  const requiredFields = ['fullname', 'username', 'password'];
  const stringFields = ['fullname', 'username', 'password'];
  const trimmedFields = ['username', 'password'];

  const missingFields = requiredFields.filter(field => !(field in req.body));
  if (missingFields.length) {
    const err = createError(400, 'Missing fields', {
      type: 'ValidationError',
      prop: missingFields
    });
    return next(err);
  }

  const notStringFields = stringFields.filter(field => typeof req.body[field] !== 'string');
  if (notStringFields.length) {
    const err = createError(400, 'Incorrect field type: expected string', {
      type: 'ValidationError',
      prop: notStringFields
    });
    return next(err);
  }

  const nonTrimmedFields = trimmedFields.filter(field => req.body[field].trim() !== req.body[field]);

  if (nonTrimmedFields.length) {
    const err = createError(400, 'Cannot start or end with whitespace', {
      type: 'ValidationError',
      prop: nonTrimmedFields
    });
    return next(err);
  }

  // if (!validator.isEmail(username)) {
  //   const err = createError(400, 'Please provide a valid email address', {
  //     type: 'ValidationError',
  //     prop: 'email'
  //   });
  //   return next(err);
  // }

  if (!validator.isLength(password, { min: 8, max: 72 })) {
    const err = createError(400, 'Password must a between 8 and 72 characters', {
      type: 'ValidationError',
      prop: 'email'
    });
    return next(err);
  }

  UserService.hasUser(req.app.get('db'), username)
    .then(exists => {
      if (exists) {
        const err = createError(409, 'Username already taken', {
          type: 'ValidationError',
          prop: 'username'
        });
        return next(err);
      }
      next();
    });
};
