const UserService = require("../services/UserService");
const UserRouter = require('express').Router();
const nodemailer = require('nodemailer');
const fs = require('fs')
const fsp = require('fs').promises;
const path = require('path')

UserRouter.put('/changepassword',async(req,res)=>{
    const {userid,password}=req.body
    await UserService.changePassword(userid,password)
    res.send('Password Changed')
})

UserRouter.put('/changename',async(req,res)=>{
    const {userid,name}=req.body
    await UserService.changeName(userid,name)
    res.send('Name Changed')
})

UserRouter.put('/changebio',async(req,res)=>{
    const {userid,bio}=req.body
    await UserService.changeBio(userid,bio)
    res.send('Bio Changed')
})

UserRouter.put('/changeuserid',async(req,res)=>{
    const {userid,newuserid}=req.body
    var updated=await UserService.changeUserId(userid,newuserid)
    res.send(updated)
})

UserRouter.put('/follow',async(req,res)=>{
    const {userid,followid}=req.body
    var data=await UserService.follow(followid,userid)
    res.send(data)
})

UserRouter.post('/search',async(req,res)=>{
    var {id}=req.body
    var users=await UserService.getAll();
    users=users.filter((user)=>user.userid.includes(id.toLowerCase()))
    res.send(users)
})

UserRouter.post('/signup', async (req, res) => {
    const user = req.body;
    var newuser = await UserService.signup(user);
    try {
        const sourceFilePath = './profilepics/Default_pfp.jpg';
        const destinationFilePath = './profilepics/' + newuser._id + '.jpg';

        await fsp.copyFile(sourceFilePath, destinationFilePath); // Use the promises version of fs
        console.log('Profile picture created.');
    } catch (error) {
        console.error(error);
        res.status(500).send("Couldn't create profile picture.");
    }
    console.log('Account created');
    res.send('Account Created');
});

UserRouter.post('/login',async (req,res)=>{
    const {userid,password}=req.body;
    var login=await UserService.login(userid,password)
    res.json(login)
})

UserRouter.post('/user',async (req,res)=>{
    const {userid}=req.body;
    var user=await UserService.getUser(userid)
    if(user) res.send(user)
    else res.send('null')
})


UserRouter.get('/getall',async (req,res)=>{
    var users=await UserService.getAll()
    res.send(users)
})

UserRouter.post('/user/followers',async (req,res)=>{
    const {userid}=req.body;
    var followers=await UserService.getFollowers(userid)
    res.send(followers)
})

UserRouter.post('/user/following',async (req,res)=>{
    const {userid}=req.body;
    var following=await UserService.getFollowing(userid)
    res.send(following)
})

UserRouter.post('/changeprofile', async(req, res) => {
    const {uid} =req.body
    if(req.files===null) return res.sendStatus(400)
    const { image } = req.files

    if (!image) return res.sendStatus(400)
    var user=await UserService.getUser(uid)
    image.name= user._id +'.jpg'
    image.mv( './profilepics/' + image.name)
    console.log("Profile pic changed")
    res.sendStatus(200);
})

UserRouter.post('/removeprofile',async (req,res)=>{
    const {userid}=req.body;
    var user=await UserService.getUser(userid)
    try {
        const folderPath = './profilepics/'; // Update to your folder path
        const existingFileName =  'Default_pfp.jpg';// Update to your existing file name
        const newFileName = user._id+'.jpg'; // Update to your new file name
    
        const existingFilePath = path.join(folderPath, existingFileName);
        const newFilePath = path.join(folderPath, newFileName);
        const existingFileExists = await fsp.access(existingFilePath).then(() => true).catch(() => false);
        
        if (!existingFileExists) {
            return res.status(404).send('Existing file not found');
        }

        // Read the content of the new file
        const existingImage = await fsp.readFile(existingFilePath);
    
        // Write the content of the new file to the existing file
        await fsp.writeFile(newFilePath, existingImage);
    
        res.status(200).send('File replaced successfully');
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    // await UserService.removeProfile(userid)
})

UserRouter.post('/sendEmail', (req, res) => {
    const {to,subject,text,html}=req.body
    
    async function sender(){
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"YOUR-EMAIL-ADDRESS",
                pass:"YOUR-APP-PASSWORD"
            }
        })
          
        var message = {
            from: 'YOUR-EMAIL-ADDRESS',
            to: to,
            subject: subject,
            text: text,
            html:html
        }

        var info=await transporter.sendMail(message)
    }

    sender().then(()=>{console.log("OTP Sent!!");res.send("success")}).catch((e)=>{console.log("Couldn't send message");res.send("failure")})

})


module.exports=UserRouter