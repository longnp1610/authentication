const mongoose = require("mongoose");
const authConfig = require("../configs/auth.config");
const { v4: uuidv4 } = require("uuid");

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiredDate: Date,
});

RefreshTokenSchema.statics.createToken = async (user) => {
  let expiredAt = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + authConfig.jwtRefeshExpireIn);
  const _token = uuidv4();
  const _obj = await saveObject({
    token: _token,
    user: user._id,
    expiredDate: expiredAt.getTime(),
  });
  return _obj;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiredDate.getTime() < new Date().getTime();
};

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

/**
 *
 * @param {object} input The input param just like the models
 * @param {string} input.token
 * @param {ObjectId} input.user
 * @param {Date} input.expiredDate
 */

const saveObject = async (input) => {
  const refreshToken = await new RefreshToken(input);
  const result = await refreshToken.save();
  return result.token;
};

module.exports = RefreshToken;
