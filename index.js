// require important modules
const express = require("express");
require("dotenv").config();

// require routes
const employeeRouter = require("./routes/employee");

// create our app
const app = express();
const port = process.env.PORT || 9000;
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// register our routes -------------------------------------------------
app.use("/", employeeRouter);

// start the server
app.listen(port, () => console.log(`server is running on port :${port}`));
