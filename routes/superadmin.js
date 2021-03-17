const express = require("express");
const Router = express.Router();
const log=require('../middleware/log');
const asyncMiddleware=require('../middleware/async');
const superadmin=require('../middleware/employeesuperadmin');
const AdminPost=require('../models/adminpost');
const Log=require('../models/auditLog');
const Post=require('../models/post');
const Employee=require('../models/employee');


//Route to check all the audit logs by superadmin. Superadmin must signedin to check all the audit logs.
Router.get('/auditlogs',[superadmin,log],asyncMiddleware(async(req,res)=>{
    let allLogs=await Log.find().sort({updatedAt:-1});
    if(allLogs.length==0)
    {
        return res.status(410).json({
            status: "Failed",
            message: "There is no log to display",
          });
    }
    return res.status(200).json({
        status: "Success",
        message: "All Logs",
        data:allLogs
      });
}));

//Route to approve the changes made by the admin. This can only be done by superadmin. Superadmin has the access for it so, superadmin must loggedin.
Router.post('/action/:id',[superadmin,log],asyncMiddleware(async(req,res)=>{
   let approval=req.body.approval;
   let adminPostId=req.params.id;
   let adminPost=await AdminPost.findById(adminPostId);
   if(!adminPost)
   {
    return res.status(404).json({
        status: "Failed",
        message: "No Admin Post with given information",
      });
   }
   let post=await Post.findById(adminPost.post);
    if(!post)
    {
        return res.status(404).json({
            status: "Failed",
            message: "There is no  Post with given information",
          });
    }
    if(approval==true)
    {
        if(adminPost.type=="UPDATE")
        {
            await Post.updateOne({_id:adminPost.post},{$set:{description:adminPost.postDescription}});
            
           
        }
        else if(adminPost.type=="DELETE")
        {
            await Post.findByIdAndDelete({_id:adminPost.post});
        }
        else if(adminPost.type=="CREATE")
        {
            let postCreate=await Post.findById(adminPost.post);
            let obj={
              description:adminPost.postDescription,
              postBy:postCreate.postBy
            }
            let newPost=new Post(obj);
            await newPost.save();
        }
    }
    await AdminPost.updateOne({_id:adminPostId},{$set:{approval:approval}});
    return res.status(200).json({
      status: "Success",
      message: "Admin post approval done",
      
    });
}));

//Route to check all the changes made by the admin on user's posts. This can only be accessed by superadmin. Superadmin must be loggedin.
Router.get('/adminpost',[superadmin,log],asyncMiddleware(async(req,res)=>{
let allAdminPost=await AdminPost.find().sort({updatedAt:-1});
console.log(allAdminPost);
if(allAdminPost.length==0)
{
    return res.status(410).json({
        status: "Failed",
        message: "There are no admin posts",
      });
}
return res.status(200).json({
    status: "Success",
    message: "All admin posts",
    data:allAdminPost
  });
}));

//Route to get all the details of all admins. Superadmin must loggedin to view this
Router.get('/all/admins',[superadmin,log],asyncMiddleware(async(req,res)=>{
let allAdmins=await Employee.find({userLevel:false});
if(allAdmins.length==0)
{
  return res.status(404).json({
    status:"failed",
    message:"There are no admins available right now"
  })
}
return res.status(200).json({
  status:"success",
  message:"All admins",
  data:allAdmins
})
}));

Router.get('/all/post',superadmin,asyncMiddleware(async(req,res)=>{
  let allPosts=await Post.find().sort({updatedAt: -1});
  if(allPosts.length==0)
  {
    return res.status(400).json({
      status:"failed",
      message:"No posts to fetch"
      
    })
  }
  return res.status(200).json({
    status:"success",
    message:"All posts",
    data:allPosts
  })
}))

Router.post('/check/post/:id',superadmin,asyncMiddleware(async(req,res)=>{
  let postId=req.params.id;
  let post=await Post.findById(postId);

  if(!post)
  {
    return res.status(404).json({
      status:"failed",
      message:"No post found with given postid"
      
    })
  }
  let postLikes=await Post.find({_id:postId},{"likesBy.likeStatus":true});
  let postDisLikes=await Post.find({_id:postId},{"likesBy.likeStatus":false});
  if(postDisLikes.length>postLikes.length)
  {
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({
      status:"success",
      message:"Post with given id and more dislikes than likes is removed"
      
    })
  }
  else
  {
    return res.status(200).json({
      status:"success",
      message:"Post has more or equal likes and dislikes"
      
    })
  }
 
}));
module.exports=Router;