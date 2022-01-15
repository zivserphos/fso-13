const express = require('express');
const app = express();

const authorRouter = require('./controllers/author');
const blogsRouter = require('./controllers/blogs');
const sessionsRouter = require('./controllers/sessions');
const readlingListsRouter = require('./controllers/readingList');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const errorHandler = require('./middlewares/errorHandler');
const authHandler = require('./middlewares/auth');
const sessionExtractor = require('./middlewares/sessionMiddle');

app.use(express.json());

app.use('/api/blogs', sessionExtractor, authHandler, blogsRouter);
app.use('/api/users', sessionExtractor, authHandler, usersRouter);
app.use('/api/author', sessionExtractor, authHandler, authorRouter);
app.use('/api/sessions', sessionExtractor, authHandler, sessionsRouter);
app.use(
  '/api/readinglists',
  sessionExtractor,
  authHandler,
  readlingListsRouter
);
app.use('/api/login', loginRouter);

app.use(errorHandler);

module.exports = app;
