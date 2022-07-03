require("dotenv").config();

module.exports = {
  SECRET_KEY: process.env.DB_SECRET_KEY,
  jwtExpireIn: 3600, // 1 hour
  jwtRefeshExpireIn: 86400, // 24 hours
};
