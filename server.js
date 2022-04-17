const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { USER, PASSWD, COLLECTION, NAME } = require("./configs/db.config");
const MONGO_URI = `mongodb+srv://${USER}:${PASSWD}@${COLLECTION}.1vjdg.mongodb.net/${NAME}?retryWrites=true&w=majority`;

require("dotenv").config();

// _______________________ MIDDLEWARE _______________________ //
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// _______________________ DATABASE CONNECT _______________________ //
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database Connected !!");
    initial();
  })
  .catch((err) => console.error(err, "Connect Failed !!"));

const db = require("./models");
const role = db.role;

// CREATE INITIAL DATA
const initial = () => {
  role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      // User Role Add
      new role({ name: "user" })
        .save()
        .then(() => console.log("user role added"));
      // Admin Role Add
      new role({ name: "admin" })
        .save()
        .then(() => console.log("admin role added"));
      // Moderator Role Add
      new role({ name: "moderator" })
        .save()
        .then(() => console.log("moderator role added"));
    }
  });
};

// _______________________ CALL ROUTER _______________________ //
const authRoute = require("./routes/auth.route");

authRoute(app);

// _______________________ CALL ROUTER _______________________ //

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
