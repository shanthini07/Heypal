const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types

const PostSchema = new mongoose.Schema({
    caption: { type: String, default:"" },
    photo: { type: String, require: true },
    likes: [{ type: ObjectId, ref: "USER" }],

    comments: [{
        comment: { type: String },
        postedby: { type: ObjectId, ref: "USER" }
    }],

    postedby: {
        type: ObjectId,
        ref: "USER",
        required:true
    }
}, { timestamps: true })

const PostModel=mongoose.model("POST", PostSchema)

module.exports=PostModel 