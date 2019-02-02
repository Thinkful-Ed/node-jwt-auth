var validator = require('validator');
const createError = require('http-errors');
const UserService = require('./users-service');

exports.validateUser = (req, res, next) => {
  const { email, password } = req.body;
  const requiredFields = ['first_name', 'last_name', 'email', 'screen_name', 'password'];
  const stringFields = ['first_name', 'last_name', 'email', 'screen_name', 'password'];
  const trimmedFields = ['screen_name', 'password'];

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

  if (!validator.isEmail(email)) {
    const err = createError(400, 'Please provide a valid email address', {
      type: 'ValidationError',
      prop: 'email'
    });
    return next(err);
  }

  if (!validator.isLength(password, { min: 8, max: 72 })) {
    const err = createError(400, 'Password must a between 8 and 72 characters', {
      type: 'ValidationError',
      prop: 'email'
    });
    return next(err);
  }

  UserService.hasUserWithEmail(req.app.get('db'), email)
    .then(hasUserWithEmail => {
      if (hasUserWithEmail) {
        const err = createError(409, 'Email address already taken', {
          type: 'ValidationError',
          prop: 'email'
        });
        return next(err);
      }
      next();
    });
};
