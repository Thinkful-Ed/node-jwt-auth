require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const compression = require('compression');

const { NODE_ENV } = require('./config');
const usersRouter = require('./users/users-router');
const loginRouter = require('./auth/login-router');
const jwtAuth = require('./middleware/jwt-auth-custom');

const articlesRouter = require('./articles/articles-router');
// const commentsRouter = require('./comments/comments-router');
// const tagsRouter = require('./tags/tags-router');

const app = express();

app.use(morgan('dev'));
app.use(compression());
app.use(cors());
app.use(helmet());

// authentication
// app.post('/auth/register')
// app.post('/users')
// app.post(jwtAuthorization)

app.use('/api/auth', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/articles', jwtAuth, articlesRouter);
// app.use('/api/comments', commentsRouter);
// app.use('/api/tags', tagsRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: 'server error' };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
