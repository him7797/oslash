const jwt = require("jsonwebtoken");
const Config=require('../config/config');

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token)
    return res
      .status(401)
      .send("Access denied no token provided Please login to continue");
  try {
    const decoded = jwt.verify(token, Config.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "Failed",
      message: "Please login to continue",
    });
  }
};
