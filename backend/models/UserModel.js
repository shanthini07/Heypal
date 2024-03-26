const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types

const UserSchema = new mongoose.Schema({
    name: {  type: String, required: true },
    userid: { type: String, required: true , unique:true },
    email: {  type: String,  required: true , unique:true },
    password: { type: String, required: true },
    bio: {  type:String ,default:""},
    followers: [{ type: ObjectId, ref: "USER" }],
    following: [{ type: ObjectId, ref: "USER" }],
    posts: [{ type:ObjectId , ref:"posts"}],
    postReg:{type:Number,default:0}
})

const UserModel=mongoose.model("USER", UserSchema)

module.exports=UserModel
   