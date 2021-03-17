const mongoose = require("mongoose");

const Log = mongoose.Schema(
  {
    operationType: {
      type: String,
      required:true
    },
    loggerId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    loggerType: {
      type: String,
    },
    message: {
      type: String,
      required:true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", Log);
