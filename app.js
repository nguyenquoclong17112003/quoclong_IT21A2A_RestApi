var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cors = require("cors");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var bookRouter = require("./routes/book");

var app = express();

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connecting to");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(logger("common"));
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Router
app.use("/v1/author", indexRouter);
app.use("/v1/book", bookRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
