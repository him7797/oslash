const jwt = require("jsonwebtoken");
const config = require("config");
const Config=require('../config/config');

module.exports = function (req, res, next) {
  const token = req.header("x-super-auth-token");

  if (!token)
    return res
      .status(401)
      .send("Access denied you are not authorized for this");
  try {
    const decoded = jwt.verify(token, Config.JWT_KEY);
    req.employeeData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "Failed",
      message: "Please login to continue",
    });
  }
};
