const mongoose = require("mongoose");

const AdminPost = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
    postDescription: {
      type: String,
      minlength:1
    },
    type: {
      type: String,
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
      required: true,
    },
    approval: {
      type: Boolean,
      default:null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminPost", AdminPost);
