module.exports = (app) => {
  const authController = require("../controllers/auth.controller");
  const verifySignup = require("../middlewares/verifySignup");
  app.post(
    "/api/auth",
    [verifySignup.checkDuplicateUsernameorEmail],
    authController.signin
  );
};
