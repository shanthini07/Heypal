const UserModel=require('../models/UserModel')

const UserService={
    signup:async(user)=>{
        var user=await UserModel.create(user)
        return user
    },

    login: async (u, p) => {
        var user = await UserModel.findOne({ userid: u ,password:p });
        return user;
    },

    changePassword:async(id,pwd)=>{
        var user=await UserModel.findOneAndUpdate({userid:id},{password:pwd})
        return user
    },

    changeBio:async(id,newbio)=>{
        var user=await UserModel.findOneAndUpdate({userid:id},{bio:newbio})
        return user
    },

    changeUserId:async(id,newid)=>{
        await UserModel.findOneAndUpdate({userid:id},{userid:newid})
        var user=await UserModel.findOne({userid:newid}) 
        return user
    },

    changeName:async(id,newname)=>{
        var user=await UserModel.findOneAndUpdate({userid:id},{name:newname})
        return user
    },
 
    getAll:async()=>{
        var users=await UserModel.find()
        return users
    },

    follow:async(followid,uid)=>{
        followid=await UserModel.findById(followid)
        uid=await UserModel.findById(uid)
        var f=false
        if(followid.followers.length>0){
            f=followid.followers.includes(uid._id)
        }
        if(!f){
            await UserModel.findByIdAndUpdate(
                uid._id,
                {
                    $push: {
                        following:followid._id
                    }
                }
            )
            await UserModel.findByIdAndUpdate(
                followid._id,
                {
                    $push: {
                        followers:uid._id
                    }
                }
            )
        }
        else{
            await UserModel.findByIdAndUpdate(
                uid._id,
                {
                    $pull: {
                        following:followid._id
                    }
                }
            )
            await UserModel.findByIdAndUpdate(
                followid._id,
                {
                    $pull: {
                        followers:uid._id
                    }
                }
            )
        }
        var user= await UserModel.findById(uid._id)
        var follow= await UserModel.findById(followid._id)
        return {user,follow}
    },

    getUser:async(id)=>{
        var user=await UserModel.findOne({userid:id})
        return user
    },

    getFollowers:async(id)=>{
        var user=await UserModel.findOne({userid:id})
        var followers=[]
        if(user.followers.length>0){
            for(let i of user.followers){
                followers.push(await UserModel.findById(i))
            }
        }
        
        return followers
    },

    getFollowing:async(id)=>{
        var user=await UserModel.findOne({userid:id})
        var following=[]
        if(user.following.length>0){
            for(let i of user.following){
                following.push(await UserModel.findById(i))
            }
        }
        return following
    },

    removeProfile:async(id)=>{
        await UserModel.findOneAndUpdate({
            userid:id
        })
    }
}
module.exports=UserService