module.exports = (app) => {
  const authController = require("../controllers/auth.controller");
  const verifySignup = require("../middlewares/verifySignup");
  app.post(
    "/api/auth/signup",
    [verifySignup.checkDuplicateUsernameorEmail],
    authController.signup
  );
  app.post("/api/auth/signin", authController.signin);
};
