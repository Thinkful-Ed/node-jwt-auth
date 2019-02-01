const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserService = require('../users/user-service');
const { JWT_EXPIRY } = require('../config');

const authRouter = express.Router();
const jsonBodyParser = express.json({ limit: '50mb' });

const localAuth = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ error: { message: 'Bad Request' } });
  }

  UserService.getByEmail(req.app.get('db'), email)
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: { message: 'Invalid credentials' } });
      }

      return bcrypt.compare(password, user.password)
        .then(isValid => {
          if (!isValid) {
            return res.status(401).json({ error: { message: 'Invalid credentials' } });
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

authRouter.route('/login')
  .post(jsonBodyParser, localAuth, (req, res, next) => {
    const user = req.user;
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({user}, secret, {
      subject: user.screen_name,
      expiresIn: JWT_EXPIRY,
      algorithm: 'HS256'
    });
    res.json({token});
  });


module.exports = authRouter;
