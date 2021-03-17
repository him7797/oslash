const mongoose = require("mongoose");

const Posts = mongoose.Schema(
  {
    description: {
      type: String,
      minlength:1,
      required: true,
    },
    postBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likesBy: [
      {
        likedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
        },
        likeStatus: {
          type: Boolean,
        },
        
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", Posts);
