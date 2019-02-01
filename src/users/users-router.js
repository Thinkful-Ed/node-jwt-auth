const express = require('express');
const url = require('url');
const UserService = require('./user-service');

const { validateUser } = require('./user-validation');

const usersRouter = express.Router();
const jsonBodyParser = express.json({ limit: '50mb' });

usersRouter.route('/')
  .post(jsonBodyParser, validateUser, (req, res, next) => {
    let { first_name, last_name, email, screen_name, password } = req.body;

    const newUser = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email,
      screen_name,
      password
    };
    return UserService.insertUser(req.app.get('db'), newUser)
      .then(user => {
        res.status(201).location(`${req.originalUrl}/${user.id}`).json(user);
      })
      .catch(next);
  });

usersRouter.route('/:user_id')
  .all((req, res, next) => {
    UserService.hasUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(hasUser => {
        if (!hasUser)
          return res.status(404).json({
            error: { message: "User doesn't exist" }
          });
        next();
        return null;
      })
      .catch(next);
  })
  .get((req, res, next) => {
    UserService.getById(req.app.get('db'), req.params.user_id)
      .then(user => {
        res.json(user);
      })
      .catch(next);
  });

module.exports = usersRouter;
