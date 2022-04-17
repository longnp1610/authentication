const db = require("../models");
const ROLES = db.ROLES;
const user = db.user;

checkDuplicateUsernameorEmail = (req, res, next) => {
  user.findOne({ username: req.body.username }).then();
};

const verifySignup = { checkDuplicateUsernameorEmail };

module.exports = verifySignup;
