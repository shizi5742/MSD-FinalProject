const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(
  "mongodb+srv://shizi:12345@cluster0.qsheq.mongodb.net?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
);

let connection;

const adminRouter = require("./routes/admin");
const driverRouter = require("./routes/drivers");
const uaaRouter = require("./authorization/uaa");
const authRouter = require("./routes/auth");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", (req, res, next) => {
  if (!connection) {
    client.connect((err) => {
      connection = client.db("Homib-Trucking");
      req.db = connection;
      next();
    });
  } else {
    req.db = connection;
    next();
  }
});

app.use(uaaRouter.givePermission);

app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/drivers", driverRouter);

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

app.listen(4500, () => {
  console.log("listeaning to port 4500....");
});

module.exports = app;
