module.exports = (app) => {
  const authController = require("../controllers/auth.controller");
  const { verifySignup } = require("../middlewares");

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [verifySignup.checkDuplicateUsernameorEmail],
    authController.signup
  );
  app.post("/api/auth/signin", authController.signin);

  app.post("/api/auth/refreshtoken", authController.refreshToken);
};
