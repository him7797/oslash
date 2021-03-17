const Log = require("../models/auditLog");

module.exports = async (req, res, next) => {
  
  let url=req.protocol + "://" + req.get("host") + req.originalUrl;
  let method=req.route.methods;
  method=Object.keys(method)[0];
  try {
    
    if (req.userData) {
      let obj = {
        operationType:method,
        loggerId: req.userData._id,
        loggerType: "User",
        message: `Requested for ${url}`,
      };
      let newLog = new Log(obj);
      await newLog.save();
    } else if (req.employeeData) {
        if(req.employeeData.userLevel==true)
        {
            let obj = {
                operationType:method,
                loggerId: req.employeeData._id,
                loggerType: "Super Admin",
                message: `Requested for ${url}`,
              }
              
              let newLog = new Log(obj);
              await newLog.save();
        }
        else
        {
            let obj = {
                operationType:method,
                loggerId: req.employeeData._id,
                loggerType: " Admin",
                message: `Requested for ${url}`,
              }
              
              let newLog = new Log(obj);
              await newLog.save();
        }
      
    }
    else {

        if(req.originalUrl[5]=='u')
        {
            let obj = {
                operationType:method,
                loggerType: "User",
                message: `Requested for ${url}`,
              };
              let newLog = new Log(obj);
              await newLog.save();
        }
        else if(req.originalUrl[5]=='e')
        {
          
            let obj = {
                operationType:method,
                loggerType: "Employee",
                message: `Requested for ${url}`,
              };
              let newLog = new Log(obj);
              await newLog.save();
        }
        
      
    }
    next();
  } catch (e) {
    next(e);
  }
};
