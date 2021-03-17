const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Config = require('../config/config');

const User = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    password: {
      type: String,
      minlength:8,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

User.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    Config.JWT_KEY
  );
  return token;
};

module.exports = mongoose.model("User", User);
