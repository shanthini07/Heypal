import { useEffect, useState } from "react"
import axios from 'axios'
import { Link, useNavigate, useParams } from "react-router-dom"

export default function Likedby(){
    const navigate=useNavigate()
    let {pid}=useParams()
    const luser=JSON.parse(localStorage.getItem('user'))
    const [likedby,setLikedby]=useState([])
    const [proceed,setproceed]=useState(false)

    const fetchlikes=async()=>{
        await axios.post('http://localhost:8081/likedby',{postid:pid}).then((data)=>{
            setproceed(true)
            setLikedby(data.data)
        })
    }
    useEffect(() => {
        fetchlikes()
    }, [])

    if(luser){
        if(proceed){
    return (<div>
        <div className="card bg-dark" style={{width:"800px",margin:"10px auto"}}>
            <div className="card-body" style={{height:"60px",color:"white"}}>
                <p>Likedby</p>
            </div>
        </div>
        {likedby.length!==0 ? likedby.map((l)=>{
            return (<div className="card" style={{width:"800px",marginBottom:"5px"}}>
                <div className="card-body" style={{height:"60px"}}>
                <img className="card-img-top"  src={"http://localhost:8081/"+l._id+".jpg"}
                     alt="pfp" style={{float:"left",width:"30px",borderRadius:"50%",marginRight:"10px",height:"30px",objectFit:"cover",objectPosition:"center center"}} 
                     onClick={()=>{
                        if(l.userid===luser.userid) navigate('/myprofile')
                        else navigate('/profilepage/'+l.userid)}}/>
                    
                <p onClick={()=>{
                    if(l.userid===luser.userid) navigate('/myprofile')
                    else navigate('/profilepage/'+l.userid)}}>{l.userid}</p>
                </div>
            </div>)
        }):<div style={{marginTop:"150px",padding:"15px"}}>
        <p style={{textAlign:"center"}}>No one has liked this post.</p>
    </div>}
    </div>)}
    else{
        return <div style={{marginTop:"250px",padding:"15px"}}>
            <p style={{textAlign:"center"}}>No such post found.</p>
        </div>
    }
    }
    else{
        return <div style={{marginTop:"150px",padding:"15px"}}>
            <p style={{textAlign:"center"}}>Your session has expired.  <Link to={'/login'}>Login </Link> </p>
        </div>
    }
}