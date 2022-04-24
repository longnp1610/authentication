require("dotenv").config();

module.exports = {
  SECRET_KEY: process.env.DB_SECRET_KEY,
  jwtExpireIn: "1hr",
  jwtRefeshExpireIn: "24hrs",
};
