const db = require("../models");
// const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameorEmail = (req, res, next) => {
  User.findOne({ username: req.body.username }).exec((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (data) {
      res.status(400).send({ message: "Failed !! Username already in use." });
      return;
    }
  });

  User.findOne({ username: req.body.email }).exec((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (data) {
      res.status(400).send({ message: "Failed !! Email is already in use." });
      return;
    }
    next();
  });
};

const verifySignup = { checkDuplicateUsernameorEmail };

module.exports = verifySignup;
