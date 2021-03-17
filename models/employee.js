const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Config = require('../config/config');
const Employees = mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 100,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength:8,
    required: true,
  },
  userLevel: {
    type: Boolean,
    
  },
});

Employees.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, userLevel: this.userLevel },
    Config.JWT_KEY
  );
  return token;
};

module.exports = mongoose.model("Employees", Employees);
