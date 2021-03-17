const express = require("express");
const Router = express.Router();
const emailValidator = require("email-validator");
const asyncMiddleware = require("../middleware/async");
const Employee = require("../models/employee");
const log = require("../middleware/log");
const superAdmin=require('../middleware/employeesuperadmin');
const bcrypt=require('bcrypt');
const _=require('lodash');

//Route to create employee. This can only be created by superadmin. Superadmin can create admins and superadmins too.
Router.post('/signUp',[superAdmin,log],asyncMiddleware(async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let userLevel = req.body.userLevel;
    if(userLevel==true)
    {
      return res.status(400).json({
        status: "Failed",
        message: "There can be only one super admin",
      });
    }
    if (name.length < 1) {
      return res.status(400).json({
        status: "Failed",
        message: "Name should be at least 5 characters",
      });
    }

    if (!emailValidator.validate(email)) {
      return res.status(400).json({
        status: "Failed",
        message: "Pleae enter a valid email address",
      });
    }

    let checkEmployee = await Employee.findOne({ email: email });
    if (checkEmployee)
      return res
        .status(401)
        .json({ status: "Failed", message: "Employee is already registered!" });
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
      userLevel: userLevel,
    };
    let newEmployee = new Employee(finalObj);
    const salt = await bcrypt.genSalt(10);
    newEmployee.password = await bcrypt.hash(newEmployee.password, salt);
    await newEmployee.save();
    return res.status(200).json({
      status: "Success",
      message: "Employee creation successful",
      data: newEmployee,
    });
  })
);

//Route to login as an employee and create jsonwebtoken. Employee can be admin and superadmin as well.
Router.post('/logIn', log, asyncMiddleware(async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!emailValidator.validate(email)) {
      return res.status(400).json({
        status: "Failed",
        message: "Pleae enter a valid email address",
      });
    }

    let checkEmployee = await Employee.findOne({ email: email });
    if (!checkEmployee)
      return res.status(404).json({
        status: "Failed",
        message: "Employee not found",
      });

    const validPassword = await bcrypt.compare(
      password,
      checkEmployee.password
    );
    if (!validPassword) return res.status(400).send("Invalid password");
    const token = checkEmployee.generateAuthToken();
    if(checkEmployee.userLevel==true)
    {
      return res
      .status(200)
      .header("x-super-auth-token", token)
      .send(_.pick(checkEmployee, ["_id", "name", "email"]));
    }
     res
      .status(200)
      .header("x-admin-auth-token", token)
      .send(_.pick(checkEmployee, ["_id", "name", "email"]));

   
  })
);

module.exports = Router;
