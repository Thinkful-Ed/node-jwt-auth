const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_EXPIRY } = require('../config');
const authLocal = require('./auth-local');

const authRouter = express.Router();
const jsonBodyParser = express.json({ limit: '50mb' });

authRouter.route('/login')
  .post(jsonBodyParser, authLocal, (req, res, next) => {
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
