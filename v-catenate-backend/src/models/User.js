const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  avatar: {
    type: String,
    default: `/public/images/avatars/default.png`,
  },
  banner: {
    type: String,
    default: `/public/images/banners/default.png`,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    number: { type: Number, default: null },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
