const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;
const authConfig = require("../configs/auth.config");

const signup = async (req, res, next) => {
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

const signin = async (req, res, next) => {
  User.findOne({ username: req.body.username })
    .populate("roles") // JOIN ROLES TABLE
    .exec(async (err, user) => {
      if (err) return handleError(err);
      if (!user) return res.status(404).send({ message: "User not found." });

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid)
        return res
          .status(401)
          .send({ accessToken: null }, { message: "Invalid Password!" });

      const accessToken = jwt.sign({ id: user.id }, authConfig.SECRET_KEY, {
        expiresIn: authConfig.jwtExpireIn,
      });

      const refreshToken = await RefreshToken.createToken(user);

      let authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: `Bearer ${accessToken}`,
        refreshToken: refreshToken,
      });
    });
};

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token is required" });
  }
  try {
    await RefreshToken.findOne({ token: refreshToken }).exec(
      (err, refreshToken) => {
        if (err) res.status(500).send({ message: err });
        if (!refreshToken) {
          res
            .status(403)
            .json({ message: "Refresh token is not in database!" });
          return;
        }

        // CHECK REFRESH TOKEN IS EXPIRED
        if (RefreshToken.verifyExpiration(refreshToken)) {
          RefreshToken.findByIdAndRemove(refreshToken._id, {
            useFindAndModify: false,
          }).exec();

          res.status(403).json({
            message:
              "Refresh token was expired. Please make a new signin request",
          });
          return;
        }

        const newAccessToken = jwt.sign(
          { id: refreshToken.user._id },
          authConfig.SECRET_KEY,
          { expiresIn: authConfig.jwtExpireIn }
        );

        return res.status(200).json({
          accessToken: `Bearer ${newAccessToken}`,
          refreshToken: refreshToken.token,
        });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

module.exports = { signin, signup, refreshToken };
