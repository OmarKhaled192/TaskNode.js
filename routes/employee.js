const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const bcrypt = require("bcrypt");
const passport = require("passport");

const initializePassport = require("../passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

app.get("/employees", async (req, res) => {
  const employees = await prisma.employee.findMany();
  res.json(employees);
});

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const {password, name, role, birthDate, profilePicture} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const date = new Date();
    const employee = await prisma.employee.create({
      data: {
        id: Date.now().toString(),
        password: hashedPassword,
        name: name,
        joinDate: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
        birthDate: birthDate,
        role: role,
        profilePicture: profilePicture
      },
    });
    console.log("from here")
    if(employee) {
      res.json('register success,' + employee);
    }
    res.redirect("/login");
  } catch(e) {
    res.send(e)
  }
});

app.delete("/logout", (req, res) => {
  // req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}
module.exports = app;
