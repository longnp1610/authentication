const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;
const Role = db.role;
const authConfig = require("../configs/auth.config");

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
    // ALSO ADD USER ROLE
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

exports.signin = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .populate("roles") // JOIN ROLES TABLE
    .exec((err, user) => {
      if (err) return handleError(err);
      if (!user) return res.status(404).send({ message: "User not found." });

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid)
        return res
          .status(401)
          .send({ accessToken: null }, { message: "Invalid Password!" });

      let token = jwt.sign({ id: user.id }, authConfig.SECRET_KEY, {
        expiresIn: authConfig.jwtExpireIn,
      });

      let authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};
