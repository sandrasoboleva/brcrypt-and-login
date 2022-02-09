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
      res.json(createdUser);
    })
    .catch((err) => {
      console.log("Something went wrong", err.errors);
      res.json(err);
    });
});

module.exports = router;

// const match = bcrypt.compareSync("password", hashedPass);
