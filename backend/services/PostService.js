const PostModel=require('../models/PostModel')
const UserModel=require('../models/UserModel');
const UserService = require('./UserService');

const PostService={
    createPost:async(post)=>{
        var p=await PostModel.create(post)
        await UserModel.findByIdAndUpdate(p.postedby,{
          $push:{
              posts:p._id
          }
      })
        return p
    },

    removePost:async(postid)=>{
        var p=await PostModel.findById(postid)
        await UserModel.findByIdAndUpdate(p.postedby,{
          $pull:{
              posts:postid
          }
        })
        await PostModel.findByIdAndDelete(postid)
        return null
    },

    addComment:async(postid,com,uid)=>{
        var user_id=await UserModel.findOne({userid:uid})
        var commentedPost = await PostModel.findByIdAndUpdate(
            postid,
            {
              $push: {
                comments:{ comment:com , postedby:user_id._id}
              }
            },
            { new: true, useFindAndModify: false }
        )
        var coms=[]
        if(commentedPost.comments.length>0){
          for(let com of commentedPost.comments){
            var user=(await UserModel.findById(com.postedby))
            coms.push({
              comment:com.comment,
              postedby:user,
              _id:com._id
            })
          }
        }

        commentedPost.comments=coms
        commentedPost.postedby=await UserModel.findById(commentedPost.postedby)
        return commentedPost
    },

    removeComment:async(postid,com)=>{
        var commentedPost = await PostModel.findByIdAndUpdate(
            postid,
            {
              $pull: {
              comments:{ _id:com }
              }
            },
            { new: true, useFindAndModify: false }
        )
        var coms=[]
        if(commentedPost.comments.length>0){
          for(let com of commentedPost.comments){
            var user=(await UserModel.findById(com.postedby))
            coms.push({
              comment:com.comment,
              postedby:user,
              _id:com._id
            })
          }
        }

        commentedPost.comments=coms
        commentedPost.postedby=await UserModel.findById(commentedPost.postedby)
        return commentedPost
    },

    like:async(postid,uid)=>{
        var user_id=await UserModel.findOne({userid:uid})
        var post=await PostModel.findById(postid)
        var f=false;
        if(post.likes.length>0){
          f=post.likes.includes(user_id._id)
        }
        
        if(!f){
          await PostModel.findByIdAndUpdate(
            postid,
            {
              $push: {
                likes:user_id._id
              }
            },
            { new: true, useFindAndModify: false }
        )
        }
        else{
          await PostModel.findByIdAndUpdate(
            postid,
            {
              $pull: {
                likes:user_id._id
              }
            },
            { new: true, useFindAndModify: false }
          )
        }
        post=await PostModel.findById(postid)
        var coms=[]
        if(post.comments.length>0){
          for(let com of post.comments){
            var user=(await UserModel.findById(com.postedby))
            coms.push({
              comment:com.comment,
              postedby:user,
              _id:com._id
            })
          }
        }

        post.comments=coms
        post.postedby=await UserModel.findById(post.postedby)
        return post
    },

    getPosts:async(uid)=>{
      var following=await UserService.getFollowing(uid)
      var p=[]
      
      if(following.length>0){
        for(let i of following){
          for(let j of i.posts){
            var temp=await PostModel.findById(j)
            var coms=[]
            if(temp.comments.length>0){
              for(let com of temp.comments){
                var user=(await UserModel.findById(com.postedby))
                coms.push({
                  comment:com.comment,
                  postedby:user,
                  _id:com._id
                })
              }
            }

            temp.comments=coms
            temp.postedby=await UserModel.findById(temp.postedby)

            p.push(temp)
          }
        }
      }
      p.sort((a,b)=>a.createdAt===b.createdAt?0:a.createdAt>b.createdAt?-1:1)
      return p
    },

    getMyPosts:async(uid)=>{
      var user=await UserService.getUser(uid)
      var posts=await PostModel.find({postedby:user._id})
      
      var myposts=[]
      if(posts.length>0){
        for(let i of posts){
            var coms=[]
            if(i.comments.length>0){
              for(let com of i.comments){
                var user=(await UserModel.findById(com.postedby))
                coms.push({
                  comment:com.comment,
                  postedby:user,
                  _id:com._id
                })
              }
            }
            i.comments=coms
            i.postedby= await UserModel.findById(i.postedby)
            myposts.push(i)
        }
      }
      myposts.sort((a,b)=>a.createdAt===b.createdAt?0:a.createdAt>b.createdAt?-1:1)
      return myposts
    },

    getLikes:async(pid)=>{
      var post=await PostModel.findById(pid)
      var likes=[]
      if(post.likes.length>0){
        for(let i of post.likes){
          likes.push(await UserModel.findById(i))
        }
      }
      return likes
    }
}
module.exports=PostService