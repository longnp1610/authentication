const mongoose = require("mongoose");
const authConfig = require("../configs/auth.config");
const { uuidv4 } = require("uuid");

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expireDate: Date,
});

RefreshTokenSchema.statics.createToken = async (user) => {
  let expireAt = new Date();
  expireAt.setSeconds(expireAt.getSeconds() + authConfig.jwtRefeshExpireIn);
  let _token = uuidv4();
  let _object = new this({
    token: _token,
    user: user_id,
    expireDate: expireAt.getTime(),
  });
  let refreshToken = await _object.save();
  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expireDate.getTime() < new Date().getTime();
};

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshToken;
