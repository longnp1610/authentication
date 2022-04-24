const mongoose = require("mongoose");

const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.role = require("./role.model");
db.refreshToken = require("./refreshToken.model");
db.ROLES = ["user", "admin", "moderator"];
module.exports = db;
