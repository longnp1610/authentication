require("dotenv").config();

module.exports = {
  USER: process.env.DB_USER,
  PASSWD: process.env.DB_PASSWD,
  COLLECTION: process.env.DB_COLLECTION,
  NAME: process.env.DB_NAME,
  SECRET_KEY: process.env.DB_SECRET_KEY,
};
