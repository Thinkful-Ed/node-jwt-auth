const express = require('express');
const jwt = require('jsonwebtoken');

const authLocal = require('./auth-local');
const { JWT_EXPIRY, JWT_SECRET } = require('../config');

const authRouter = express.Router();
const jsonBodyParser = express.json({ limit: '50mb' });

authRouter.route('/login')
  .all(jsonBodyParser, authLocal )
  .post((req, res, next) => {
    const user = req.user;

    const token = jwt.sign({ user }, JWT_SECRET, {
      subject: user.username,
      expiresIn: JWT_EXPIRY
    });

    res.json({ token });
  });


module.exports = authRouter;
