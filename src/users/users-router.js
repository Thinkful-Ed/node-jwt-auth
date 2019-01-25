const Ajv = require('ajv');
const express = require('express');
const path = require('path');
const UserService = require('./user-service');
const userSchema = require('./user-schema');

const usersRouter = express.Router();
const jsonBodyParser = express.json({ limit: '50mb' });

// required: 'username', 'password' => 422
// strings: 'username', 'password', 'firstName', 'lastName' => 422
// pre-trimmed: 'username', 'password' => 422

// email: is email => 422
// password: length min 8 max 72 => 422

// email is unique: search DB => 422
// trim first and lastname

const ajv = new Ajv({ allErrors: true });

ajv.addFormat('password', () => {
  return false;
});
const validate = ajv.compile(userSchema);

usersRouter.route('/')
  .get((req, res, next) => {
    UserService.getAll(req.app.get('db'))
      .then(users => {
        res.json(users);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { first_name, last_name, email, screen_name, password } = req.body;
    const newUser = { first_name, last_name, email, screen_name, password };

    var valid = validate(newUser);
    if (!valid) console.log(validate.errors);

    res.json(newUser);

    // UserService.hasUserWithEmail(req.app.get('db'), newUser.email)
    //   .then(hasUserWithEmail => {
    //     if (hasUserWithEmail)
    //       return res.status(400).json({ error: { message: 'Email already taken' } });

    //     return UserService.insertUser(req.app.get('db'), newUser)
    //       .then(user => {
    //         res.status(201).location(path.join(req.originalUrl, user.id)).json(user);
    //       });
    //   })
    //   .catch(next);
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
            error: { message: 'User doesn\'t exist' }
          });
        next();
        return null;
      })
      .catch(next);
  })
  .get((req, res, next) => {
    UserService.getById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        res.json(user);
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { first_name, last_name, email, screen_name } = req.body;
    if (
      first_name == null
      && last_name == null
      && email == null
      && screen_name == null
    )
      return res.status(400).json({
        error: {
          message: 'Request body must contain either \'first_name\', \'last_name\', \'email\' or \'screen_name\''
        }
      });

    const newFields = {
      date_modified: 'now()'
    };
    if (first_name) newFields.first_name = first_name;
    if (last_name) newFields.last_name = last_name;
    if (email) newFields.email = email;
    if (screen_name) newFields.screen_name = screen_name;

    UserService.hasUserWithEmail(
      req.app.get('db'),
      newFields.email
    )
      .then(hasUserWithEmail => {
        if (hasUserWithEmail)
          return res.status(400).json({
            error: { message: 'Email already taken' }
          });

        return UserService.updateUser(
          req.app.get('db'),
          req.params.user_id,
          newFields
        )
          .then(() => {
            res.status(204).end();
          });
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    UserService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
