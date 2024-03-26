import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from './Layout';

export default function ProfilePage(){
    let {oid}=useParams()
 
    let navigate=useNavigate()
    const [fc,sfc]=useState("Follow")
    
    const [ouser,setOuser]=useState({})
    const [luser,setLuser]=useState({})
    const [posts,setPosts]=useState([])
    const [loaded,load]=useState(false)

    const fetchPosts = async () => {
        var lu=JSON.parse(localStorage.getItem('user'))
        var lus= await axios.post('http://localhost:8081/user',{userid:lu.userid})

        var ous= await axios.post('http://localhost:8081/user',{userid:oid})
        if(ous.data===null){
            return ([lus.data,null,[]])
        }

        if(lus.data.userid===oid){
            navigate('/myprofile')
        }
        lus.data.following.includes(ous.data._id)?sfc("Unfollow"):sfc("Follow")

        var req = await axios.post('http://localhost:8081/getmyposts', { userid: ous.data.userid })

        var sortedposts=req.data
        return ([lus.data,ous.data,sortedposts])
    }
    useEffect(() => {
        fetchPosts().then((data) =>{ 
            setLuser(data[0]);
            setOuser(data[1]);
            setPosts(data[2]);
            load(true)
        }).catch((err) => console.log(err))
    }, [])

    const Like = async (event, pid) => {
        if (event.detail == 2) {
            await axios.put('http://localhost:8081/like', {
                userid: luser.userid,
                postid: pid
            }).then((data)=>{
                const index = posts.findIndex(post => post._id === pid);        // Create a copy of the current posts array
                const updatedPosts = [...posts];
                updatedPosts[index] = data.data;
                setPosts(updatedPosts);
            })            
        }
    }

    const Comment=async(e,pid,uid)=>{
        e.preventDefault()
        if(document.getElementById(pid).value){
            await axios.put('http://localhost:8081/addcomment',{
            postid:pid,
            comment:document.getElementById(pid).value,
            userid:uid
        }).then((data)=>{
            const index = posts.findIndex(post => post._id === pid);        // Create a copy of the current posts array
            const updatedPosts = [...posts];
            updatedPosts[index] = data.data;
            setPosts(updatedPosts);
        })}
        e.target.reset()
    }

    const removeComment=async(pid,com)=>{

        await axios.put('http://localhost:8081/removecomment',{
            pid:pid,
            comment:com
        }).then((data)=>{
            const index = posts.findIndex(post => post._id === pid);        // Create a copy of the current posts array
            const updatedPosts = [...posts];
            updatedPosts[index] = data.data;
            setPosts(updatedPosts);
        })
    }

    const viewcomments=(p,c)=>{
        if(c.postedby.userid===luser.userid){
            return <div style={{margin:"1px",paddingLeft:"10px"}}>
                <img className="card-img-top"  src={"http://localhost:8081/"+c.postedby._id+".jpg"}
                     alt="pfp" style={{float:"left",width:"30px",borderRadius:"50%",marginRight:"10px",height:"30px",objectFit:"cover",objectPosition:"center center"}}/>
                <p><b style={{marginRight:"5px",width:"auto"}} onClick={()=>navigate('/myprofile')}>{c.postedby.userid}</b>{c.comment} <img onClick={()=>{removeComment(p,c._id)}} src="trashbin.png" alt="remove comment" style={{width:"20px",margin:0}} /></p>
            </div>
        }
        else{
            return <div style={{margin:"1px",paddingLeft:"10px"}}>
                <img className="card-img-top"  src={"http://localhost:8081/"+c.postedby._id+".jpg"}
                     alt="pfp" style={{float:"left",width:"30px",borderRadius:"50%",marginRight:"10px",height:"30px",objectFit:"cover",objectPosition:"center center"}}/>
                <p><b style={{marginRight:"5px",width:"auto"}} onClick={()=>navigate('/profilepage/'+c.postedby.userid)}>{c.postedby.userid}</b>{c.comment}</p>
            </div>
        }
           
    }

    const toggler=(pid)=>{
        var vis=document.getElementById("comments"+pid).style.visibility
        if(vis==="hidden"){
            document.getElementById("comments"+pid).style.visibility="visible"
            document.getElementById("comments"+pid).style.height="auto"
        }
        else{
            document.getElementById("comments"+pid).style.visibility="hidden"
            document.getElementById("comments"+pid).style.height="0"
        }
    }

    const follow=async()=>{
            await axios.put('http://localhost:8081/follow',{
            userid:luser._id,
            followid:ouser._id
        }).then((data)=>{
            setLuser(data.data.user)
            setOuser(data.data.follow)
        })
        if(fc==="Follow") sfc("Unfollow")
        else sfc("Follow")
    }

    const viewbio=(bio)=>{
        var BIO=bio.split("\n")
        return (<div style={{marginLeft:"20px",marginBottom:"10px"}}>
            {BIO.map((b)=>{
                return <p style={{margin:"0px"}}>{b}</p>
            })}
        </div>)
    }

    const month=(m)=>{
        switch(m){
            case '01':return 'Jan'
            case '02':return 'Feb'
            case '03':return 'Mar'
            case '04':return 'Apr'
            case '05':return 'May'
            case '06':return 'June'
            case '07':return 'July'
            case '08':return 'Aug'
            case '09':return 'Sep'
            case '10':return 'Oct'
            case '11':return 'Nov'
            default: return 'Dec'
        }
    }

    if(ouser && loaded){
    return (<div>
    <div className="card" style={{width:"600px"}}>
        <div className='card-body' style={{height:"60px"}}>
            <p style={{width:"400px",float:"left"}}>{ouser.userid}</p>
        </div>

        <div className='card-body' style={{height:"170px"}}>
            <div className='card-item'>
            <div style={{width:"150px",float:"left"}}>
                <img src={"http://localhost:8081/"+ouser._id+".jpg"} style={{width:"130px",borderRadius:"50%",objectFit:"cover",objectPosition:"center center",height:"130px"}}/>
            </div>
            <div style={{width:"380px",float:"right",height:"130px"}}>
                <div style={{float:"left",textAlign:"center",marginTop:"35px",width:"110px"}}>
                    <p>{ouser.posts.length}</p>
                    <p>Posts</p>
                </div>
                <div onClick={()=>{navigate('/followers/'+ouser.userid)}} style={{float:"left",textAlign:"center",marginTop:"35px",width:"110px"}}>
                    <p>{ouser.followers.length}</p>
                    <p>Followers</p>
                </div>
                <div onClick={()=>{navigate('/following/'+ouser.userid)}} style={{float:"left",textAlign:"center",marginTop:"35px",width:"110px"}}>
                    <p>{ouser.following.length}</p>
                    <p>Following</p>
                </div>
            </div>
            </div>
        </div>
    </div>
    <div className='card' style={{width:"600px"}}>
        <div className='card-body' style={{height:"50px"}}>
            <h6>{ouser.name}</h6>
        </div>
        {ouser.bio && viewbio(ouser.bio) }
        <button className='btn btn-dark' onClick={()=>{
            follow()
        }}>{fc}</button>
    </div>
    <div>
    {posts.length>0 && posts.map((post)=>{
        var p = post._id;
        return <div className="card" style={{ width: "600px", marginBottom: "10px" }}>
        <div className="card-body">
            <img className="card-img-top" src={"http://localhost:8081/"+ouser._id+".jpg"} alt="Card cap" style={{float:"left",height:"35px",width:"35px",borderRadius:"50%",marginRight:"10px",objectFit:"cover",objectPosition:"center center"}}/>
            <p style={{marginTop:"6px"}}>{ouser.userid}</p>
        </div>
        <img className="card-img-top" onClick={(event) => { Like(event, p) }} src={"http://localhost:8081/"+post.photo} alt={post.photo} />
        <div className="card-body" >
            <img className="card-img-top" onClick={(event) => { Like(event, p) }} src={"http://localhost:8081/"+post.postedby._id+".jpg"}
                            alt="pfp" style={{float:"left",width:"30px",borderRadius:"50%",marginRight:"10px",height:"30px",objectFit:"cover",objectPosition:"center center"}}/>
            <p><b>{post.postedby.userid}</b> {post.caption}</p>
            <p><img src="like.png" onClick={() => { navigate('/likedby/'+p) }} style={{width:"30px"}} alt="Like" /> {post.likes.length} <img src="comment.png" onClick={()=>{toggler(p)}} style={{width:"30px",marginLeft:"5px"}} alt="Comment" /> {post.comments.length}</p>
            <form onSubmit={(event)=>Comment(event,p,luser.userid)}>
                <input type="text" className='form-control' name='comment' id={p} placeholder="Add a comment" style={{ float: "left", width: "450px" }} />
                <button type="submit" className='btn ' style={{ backgroundColor:"black",color:"white",margin: 0, marginLeft: "5px" }}>Comment</button>
            </form>
        </div>
        <div id={"comments"+p} style={{visibility:"hidden",height:0}}>
            {post.comments.map((c)=>{
                return viewcomments(p,c)})}
        </div>
        <p style={{margin:"2px",paddingLeft:"10px"}}>{post.createdAt.substring(8,10)} {month(post.createdAt.substring(5,7))} {post.createdAt.substring(0,4)} </p>
    </div>
    })}
    {posts.length===0 && <div className="card" style={{padding:"100px",width:"600px"}}>
            <p style={{textAlign:"center"}}> This user has not posted anything</p>
            <p style={{textAlign:"center",color:"blue"}} onClick={()=>navigate("/search")}> Find more people </p>
        </div> }
    </div>
    </div>
  )}
  else{
        return <div style={{marginTop:"150px",padding:"15px"}}>
        <p style={{textAlign:"center"}}>No such user found. :(</p>
    </div>
    }
};
