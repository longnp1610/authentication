const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;
const Role = db.role;

exports.signup = async (req, res, next) => {
  const user = await new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });
  // SAVE INTO DB
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    // ADD USER ROLE
    Role.findOne({ name: "user" }).exec((err, role) => {
      if (err) {
        res.status(500).send({ message: err.message });
        return;
      }
      user.roles.push(role);
      user
        .save()
        .then(() =>
          res.status(200).send({ message: "User created successfully." })
        )
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    });
  });
};

exports.signin = () => {};
