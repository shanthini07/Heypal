import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {  Link, useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate=useNavigate()

    const [luser,setLuser]=useState({})
    const [posts,setPosts]=useState([])

    const fetchPosts = async () => {
        const lu=JSON.parse(localStorage.getItem('user'))
        if(!lu){
            setLuser(null);
            return
        }
        var user=await axios.post('http://localhost:8081/user',{userid:lu.userid})
        var req = await axios.post('http://localhost:8081/getposts', { userid: user.data.userid })
        var sortedposts=req.data
        return ([user.data,sortedposts])
    }
    useEffect(() => {
        fetchPosts().then((data) =>{
            setPosts(data[1]);
            setLuser(data[0])
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
                <img className="card-img-top" onClick={()=>navigate('/myprofile')} src={"http://localhost:8081/"+c.postedby._id+".jpg"}
                    alt="pfp" style={{float:"left",width:"25px",borderRadius:"50%",marginRight:"10px",height:"25px",objectFit:"cover",objectPosition:"center center"}}/>
                <p><b style={{marginRight:"5px",width:"auto"}} onClick={()=>navigate('/myprofile')}>{c.postedby.userid}</b>{c.comment} <img onClick={()=>{removeComment(p,c._id)}} src="trashbin.png" alt="remove comment" style={{width:"20px",margin:0}} /></p>
            </div>
        }
        else{
            return <div style={{margin:"1px",paddingLeft:"10px"}}>
                <img className="card-img-top" onClick={()=>navigate('/profilepage/'+c.postedby.userid)} src={"http://localhost:8081/"+c.postedby._id+".jpg"}
                    alt="pfp" style={{float:"left",width:"25px",borderRadius:"50%",marginRight:"10px",height:"25px",objectFit:"cover",objectPosition:"center center"}}/>
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
    
    if(luser){
    return (<div>
        {posts.length>0 && posts.map((post) => {
                var p = post._id
                
                return <div className="card post" style={{ width: "600px", marginBottom: "10px" }}>
                    <div className="card-body" onClick={()=>{navigate('/profilepage/'+post.postedby.userid)}}>
                        <img className="card-img-top profilepic" src={"http://localhost:8081/"+post.postedby._id+".jpg"}
                         alt="pfp" style={{float:"left",width:"35px",borderRadius:"50%",marginRight:"10px",height:"35px",objectFit:"cover",objectPosition:"center center"}}/>
                        <p style={{marginTop:"4px"}}>{post.postedby.userid}</p>
                    </div>
                    <img className="card-img-top" onClick={(event) => { Like(event, p) }} src={"http://localhost:8081/"+post.photo} alt="Card cap" />
                    <div className="card-body" >
                        <div>
                            <img className="card-img-top" onClick={(event) => { Like(event, p) }} src={"http://localhost:8081/"+post.postedby._id+".jpg"}
                            alt="pfp" style={{float:"left",width:"30px",borderRadius:"50%",marginRight:"10px",height:"30px",objectFit:"cover",objectPosition:"center center"}}/>
                            <p><b onClick={()=>navigate('/profilepage/'+post.postedby.userid)}>{post.postedby.userid}</b> {post.caption}</p>
                        </div>
        
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
        {posts.length===0 && <div style={{marginTop:"150px",padding:"15px"}}>
            <p style={{textAlign:"center"}}>You have not followed anyone or the people you follow have not posted yet</p>
            <p style={{textAlign:"center",color:"blue"}} onClick={()=>navigate("/search")}>Find More people</p>
            </div>}
    </div>)}
    else{
        return <div style={{marginTop:"150px",padding:"15px"}}>
            <p style={{textAlign:"center"}}>Your session has expired.  <Link to={'/login'}>Login </Link> </p>
        </div>
    }
}