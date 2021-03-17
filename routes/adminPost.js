const express = require("express");
const Router = express.Router();
const Post=require('../models/post');
const AdminPost=require('../models/adminpost');
const Log=require('../models/auditLog');
const auditlog=require('../middleware/log');
const adminauth=require('../middleware/employeeauth');
const asyncMiddleware=require('../middleware/async');

//Route for creating post on user's behalf. Admin must be loggedin to create it.
Router.post('/:id',[adminauth,auditlog],asyncMiddleware(async(req,res)=>{
    let description=req.body.description;
    if(description.length<1)
    {
        return res.status(400).json({
            status: "Failed",
            message: "Description is less tha 1 character",
          });
    }
    let postId=req.params.id;
    let postInfo=await Post.findById(postId);
    if(!postInfo)
    {
        return res.status(410).json({
            status: "Failed",
            message: "There is no post with given information",
          });
    }
    let obj={
        post:postId,
        postDescription:description,
        type:"CREATE",
        employee:req.employeeData._id,
    }
    let newAdminPost=new AdminPost(obj);
    await newAdminPost.save();
    return res.status(200).json({
        status: "Success",
      });

}));

//Route for getting all the users posts. Admin must be loggedin to view all the posts 
Router.get('/users/posts',[adminauth,auditlog],asyncMiddleware(async(req,res)=>{
    let allPosts=await Post.find().sort({updatedAt:-1});
    if(allPosts.length==0)
    {
        return res.status(410).json({
            status: "Failed",
            message: "There are no posts to display",
          });
    }
    return res.status(200).json({
        status: "Success",
        message: "All posts",
        data:allPosts
      });
}));
Router.delete('/:id',[adminauth,auditlog],asyncMiddleware(async(req,res)=>{
    let postId=req.params.id;
    let post=await Post.findById(postId);
    if(!post)
    {
        return res.status(410).json({
            status: "Failed",
            message: "There is no post with given post details",
          });
    }
    let obj={
        post:postId,
        type:"DELETE",
        employee:req.employeeData._id,
        
    }
    let newAdminPost=new AdminPost(obj);
    await newAdminPost.save();
    return res.status(200).json({
        status: "Success",
      });
}));

//Route for making changes on user's post. Admin must be logged in to make changes.
Router.put('/:id',[adminauth,auditlog],asyncMiddleware(async(req,res)=>{
    let description=req.body.description;
    if(description.length<1)
    {
        return res.status(400).json({
            status: "Failed",
            message: "Description should be atleast 1 character",
          });
    }
    let postId=req.params.id;
    let postInfo=await Post.findById(postId);
    if(!postInfo)
    {
        return res.status(400).json({
            status: "Failed",
            message: "There is no post with given information",
          });
    }
    let obj={
        post:postId,
        postDescription:description,
        type:"UPDATE",
        employee:req.employeeData._id,
        
    }
    let newAdminPost=new AdminPost(obj);
    await newAdminPost.save();
    return res.status(200).json({
        status: "Success",
      });
}));

//Route to view all the audit logs.
Router.get('/logs',[adminauth,auditlog],asyncMiddleware(async(req,res)=>{
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
}))



module.exports=Router;