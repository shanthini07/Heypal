const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const PostService = require("../services/PostService");
const PostRouter = require('express').Router();
const UserService = require("../services/UserService");
const fs = require('fs')

PostRouter.post('/removepost',async(req,res)=>{
    var {postid}=req.body
    var post=await PostModel.findById(postid)
    const filename = post.photo;
    const filePath = `./public/${filename}`;
    fs.access(filePath, fs.constants.F_OK, async(err) => {
    if (err) {
      return res.status(404).send('File not found.');
    }


    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      }

      console.log('Post removed');
    });
     });
    await PostService.removePost(postid)
    res.send('Removed')
})

PostRouter.put('/addcomment',async(req,res)=>{
    var {postid,comment,userid}=req.body
    var updatedpost=await PostService.addComment(postid,comment,userid)
    res.send(updatedpost)
})

PostRouter.put('/removecomment',async(req,res)=>{
    var {pid,comment}=req.body
    var updatedpost=await PostService.removeComment(pid,comment)
    res.send(updatedpost)
})

PostRouter.put('/like',async(req,res)=>{
    var {postid,userid}=req.body
    var updatedpost=await PostService.like(postid,userid)
    res.send(updatedpost)
})


PostRouter.post('/getposts',async(req,res)=>{
    var {userid}=req.body
    var posts=await PostService.getPosts(userid)
    res.send(posts)
})

PostRouter.post('/getmyposts',async(req,res)=>{
    var {userid}=req.body
    var posts=await PostService.getMyPosts(userid)
    res.send(posts)
})

PostRouter.post('/likedby',async(req,res)=>{
    var {postid}=req.body
    var likedby=await PostService.getLikes(postid)
    res.send(likedby)
})

PostRouter.post('/createpost', async(req, res) => {
    const {cap,uid} =req.body
    if(req.files===null) return res.sendStatus(400)
    const { image } = req.files
    if (!image) res.sendStatus(0)

    var user=await UserService.getUser(uid)
    image.name=user._id+user.postReg+'.jpg'
    await UserModel.findByIdAndUpdate(user._id,{postReg:user.postReg+1})
    image.mv('./public/' + image.name);
    var p=await PostService.createPost({
        photo:image.name,
        caption:cap,
        postedby:user._id
    })
    res.sendStatus(200);
})


module.exports=PostRouter