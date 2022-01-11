const express = require("express");
const app = express();

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const errorHandler = require("./middlewares/errorHandler");
const authHandler = require("./middlewares/auth");

app.use(express.json());

app.use("/api/blogs", authHandler, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(errorHandler);

module.exports = app;
