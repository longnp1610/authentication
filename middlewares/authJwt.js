const jwt = require("jsonwebtoken");
const config = require("../configs/db.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) return res.status(403).send({ message: "No token provided!" });

  jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).send({ message: "Unauthorized!" });
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) return handleError(err);

    // FIND ROLE IN ROLES ARRAY
    Role.find({ _id: { $in: user.roles } }).exec((err, roles) => {
      if (err) return handleError(err);
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(403).send({ message: "Admin role required!" });
      return;
    });
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) return handleError(err);

    // FIND ROLE IN ROLES ARRAY
    Role.find({ _id: { $in: user.roles } }).exec((err, roles) => {
      if (err) return handleError(err);
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }
      res.status(403).send({ message: "Moderator role required!" });
      return;
    });
  });
};

const authjwt = { verifyToken, isAdmin, isModerator };

module.exports = authjwt;
