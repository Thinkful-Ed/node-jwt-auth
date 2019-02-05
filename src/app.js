require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const createError = require('http-errors');
const compression = require('compression');

const { NODE_ENV } = require('./config');
const usersRouter = require('./users/users-router');
const loginRouter = require('./auth/login-router');
const authJWT = require('./auth/auth-jwt');

const itemsRouter = require('./items/items-router');

const app = express();

app.use(morgan('dev'));
app.use(compression());
app.use(cors());
app.use(helmet());

app.use('/api/users', usersRouter);
app.use('/api/auth', loginRouter);
app.use('/api/items', authJWT, itemsRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use((req, res, next) => {
  const err = createError(404, 'Not Found');
  next(err);
});

app.use((err, req, res, next) => {
  if (err instanceof createError.HttpError) {
    return res.status(err.status).json({ message: err.message, error: err });
  }
  next(err);
});

app.use((error, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { message: 'Internal Server Error' };
  } else {
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
