const PostRouter = require("./routes/PostRouter");
const UserRouter = require("./routes/UserRouter");
const mongoose=require('mongoose')
const fileUpload = require('express-fileupload');

var app=require('express')()
var jbp=require('body-parser').json()
var cors=require('cors')()
var urle=require('body-parser').urlencoded({ extended: false })
var express=require('express')

app.use(fileUpload());
app.use(jbp)
app.use(cors)
app.use(urle)

app.use(express.static('public'));
app.use(express.static('profilepics'));
app.use(PostRouter)
app.use(UserRouter)

mongoose.connect('YOUR-MONGODB-URL').then(()=>{
    console.log("Successfully Connected")
}).catch(()=>{
    console.log("Could not connect")
})

app.listen(8081,()=>{
    console.log('HeyPal! Backend is live...')
})