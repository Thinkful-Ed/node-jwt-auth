const path = require('path');
const express = require('express');
const createError = require('http-errors');
const UserService = require('./users-service');

const { validateUser } = require('./users-validation');

const usersRouter = express.Router();
const jsonBodyParser = express.json({ limit: '50mb' });

usersRouter.route('/')
  .post(jsonBodyParser, validateUser, (req, res, next) => {
    let { fullname, username, password } = req.body;

    const newUser = {
      fullname: fullname.trim(),
      username: username.trim(),
      password
    };

    return UserService.insertUser(req.app.get('db'), newUser)
      .then(user => {
        res.status(201)
          .location(path.posix.join(req.originalUrl, user.id.toString()))
          .json(user);
      })
      .catch(next);
  });

usersRouter.route('/:user_id')
  .get((req, res, next) => {
    UserService.getById(req.app.get('db'), req.params.user_id)
      .then(user => {
        if (user) {
          res.json(user);
        } else {
          const err = createError(404, 'User does not exist');
          return next(err);
        }
      })
      .catch(next);
  });

module.exports = usersRouter;
