const express = require("express");
const Router = express.Router();
const asyncMiddleware = require("../middleware/async");
const userAuth = require("../middleware/userauth");
const Post = require("../models/post");
const log = require("../middleware/log");

//Route to create post. Only if the user has logged in can create any post
Router.post('/',[userAuth, log],asyncMiddleware(async (req, res) => {
    let description = req.body.description;
    let postBy = req.userData._id;
    if (description.length < 1) {
      return res.status(400).json({
        status: "Failed",
        message: "Description about the post should at least of 1 character",
      });
    }
    let postDeatils = {
      description: description,
      postBy: postBy,
    };
    let newPost = new Post(postDeatils);
    await newPost.save();
    return res.status(200).json({
      status: "Success",
      message: "Post Created Successfully",
      data: newPost,
    });
  })
);

//Route to get all the posts of a particular user. User has to be logged in to check his/her posts
Router.get('/byUser',[userAuth, log],asyncMiddleware(async (req, res) => {
    let allPosts = await Post.find({ postBy: req.userData._id }).sort({updatedAt: -1});
    if (allPosts.length == 0) {
      return res.status(404).json({
        status: "Failed",
        message: "There are no posts with given user details",
      });
    }
    return res.status(200).json({
      status: "Success",
      data: allPosts,
    });
  })
);

//Route to delete post of a particular post. User must logged in to delete his/her post.
Router.delete('/:id',[userAuth, log],asyncMiddleware(async (req, res) => {
    let post = await Post.findOneAndRemove({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({
        status: "Failed",
        message: "There is no posts with given post details",
      });
    }
    return res.status(200).json({
      status: "Success",
      message: "Post Deleted Successfully",
    });
  })
);

//Route for like or dislike a particular post
Router.post('/action/:id',userAuth,asyncMiddleware(async(req,res)=>{
  let postId=req.params.id;
  let userId=req.userData._id;
  let post=await Post.findById(postId);
  if(!post)
  {
    return res.status(404).json({
      status: "Failed",
      message: 'Post Not found with given information'
  });
  }
  let checkLike=await Post.find({$and:[{_id:postId},{"likesBy.likedBy":userId},{"likesBy.likeStatus":true}]});
  let checkDislike=await Post.find({$and:[{_id:postId},{"likesBy.likedBy":userId},{"likesBy.likeStatus":false}]});
  if(checkLike.length>0)
  {
    await Post.updateOne({_id:postId,likesBy:{$elemMatch:{likedBy:userId,likeStatus:true}}},{ $set: { "likesBy.$.likeStatus" : false } });
    return res.status(200).json({
      status: "Success",
      message: 'Post DisLiked'
  });
  } 
  else if(checkDislike.length>0){
    await Post.updateOne({_id:postId,likesBy:{$elemMatch:{likedBy:userId,likeStatus:false}}},{ $set: { "likesBy.$.likeStatus" : true } });
    return res.status(200).json({
      status: "Success",
      message: 'Post Liked'
  });
  }
  else
  {
    let obj;
    obj={
        $addToSet:{
            likesBy:{
                likedBy:userId,
                createdAt:Date.now(),
                likeStatus:true
            },
        },
    };
    await Post.updateOne({_id:postId},obj);
    return res.status(200).json({
      status: "Success",
      message: 'Post Liked'
  });
  }
}));

module.exports = Router;
