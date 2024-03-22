var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");

// var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var projectsRouter = require("./routes/projects");
var tasksRouter = require("./routes/tasks");
var authRouter = require('./routes/auth')

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [process.env.REACT_APP_URI]
  })
);

// app.use('/', indexRouter);
app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
app.use("/tasks", tasksRouter);
app.use('/auth', authRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

module.exports = app;
