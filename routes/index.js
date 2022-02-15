var express = require("express");
const req = require("express/lib/request");
var router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signup", function (req, res, next) {
  const passTest = "password";

  const salt = bcrypt.genSaltSync(saltRounds);

  const hashedPass = bcrypt.hashSync(passTest, salt);

  console.log("SALT", salt);
  console.log("hashedPass", hashedPass);

  const match = bcrypt.compareSync("password", hashedPass);

  console.log("Do they match?", match);
});

module.exports = router;