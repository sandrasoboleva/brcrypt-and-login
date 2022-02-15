var express = require("express");
const req = require("express/lib/request");
var router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const saltRounds = 10;

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signup", function (req, res, next) {
  let errors = [];

  if (!req.body.username) {
    errors.push("You did not include a name!");
  }
  if (!req.body.password) {
    errors.push("You need a password");
  }
  if (errors.length > 0) {
    res.json(errors);
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(req.body.password, salt);

  User.create({
    username: req.body.username,
    password: hashedPass,
  })
    .then((createdUser) => {
      console.log("User was created", createdUser);
      console.log(req.session);

      req.session.user = createdUser;

      console.log(req.session.user);
      res.json(createdUser);
    })
    .catch((err) => {
      console.log("Something went wrong", err);
      res.json(err);
    });
});

router.post("/login", (req, res) => {

  let errors = [];
  if (!req.body.username) {
    errors.push("You did not include a name!");
  }
  if (!req.body.password) {
    errors.push("You need a password");
  }

  if (errors.length > 0) {
    res.json(errors);
  }


  User.findOne({ username: req.body.username })
    .then((foundUser) => {

      if (!foundUser) {
      
        return res.json("Username not found");
      }

      const match = bcrypt.compareSync(req.body.password, foundUser.password);

      if (!match) {

        return res.json("Incorrect password");
      }

      req.session.user = foundUser;

      console.log(req.session.user);
      res.json(`Welcome to our website, ${req.session.user.username}!`);
    })
    .catch((err) => {
      console.log("Something went wrong", err);
      res.json(err);
    });
});

router.get("/test-session", (req, res) => {
  console.log("Req session", req.session);
  if (req.session?.user?.username) {
    res.json(`Hi ${req.session.user.username}!`);
  } else {
    res.json("You are not logged in");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  console.log("This is the session", req.session);
  res.json("you have logged out");
});

module.exports = router;