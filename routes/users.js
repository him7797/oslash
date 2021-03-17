const express = require("express");
const Router = express.Router();
const asyncMiddleware = require("../middleware/async");
const User = require("../models/user");
let log = require("../middleware/log");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const _ = require("lodash");




//Route for creating users.
Router.post('/signUp',log,asyncMiddleware(async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    if (name.length <1 ) {
      return res.status(400).json({
        status: "Failed",
        message: "Name should be at least 1 character",
      });
    }

    if (!emailValidator.validate(email)) {
      return res.status(400).json({
        status: "Failed",
        message: "Pleae enter a valid email address",
      });
    }

    let checkUser = await User.findOne({ email: email });
    if (checkUser)
      return res
        .status(404)
        .json({ status: "Failed", message: "User is already registered!" });
    if (password.length < 8) {
      return res.status(400).json({
        status: "Failed",
        message: "Pleae enter at least 8 charaters length password",
      });
    }
    let finalObj = {
      name: name,
      email: email,
      password: password,
    };
    let newUser = new User(finalObj);
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();
    return res.status(200).json({
      status: "Success",
      message: "User creation successful",
      data: newUser,
    });
  }));

//Route for user logging in.
Router.post('/logIn', log, asyncMiddleware(async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!emailValidator.validate(email)) {
      return res.status(400).json({
        status: "Failed",
        message: "Pleae enter a valid email address",
      });
    }

    let checkUser = await User.findOne({ email: email });
    if (!checkUser)
      return res.status(404).json({
        status: "Failed",
        message: "User not found",
      });

    const validPassword = await bcrypt.compare(password, checkUser.password);
    if (!validPassword) return res.status(400).json({
      status:"Failed",
      message:"Password is incorrect"
    });

    const token = checkUser.generateAuthToken();

    res
      .status(200)
      .header("x-auth-token", token)
      .send(_.pick(checkUser, ["_id", "name", "email"]));
  })
);


module.exports = Router;
