const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const UserService = require('../users/users-service');

const localAuth = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const err = createError(401, 'Bad Request');
    return next(err);
  }

  UserService.getByUsername(req.app.get('db'), username)
    .then(user => {
      if (!user) {
        const err = createError(401, 'Invalid credentials');
        return next(err);
      }

      return bcrypt.compare(password, user.password)
        .then(isValid => {
          if (!isValid) {
            const err = createError(401, 'Invalid credentials');
            return next(err);
          }
          delete user.password;
          req.user = user;
          next();
        });
    })
    .catch((err) => {
      next(err);
    });
};


module.exports = localAuth;
