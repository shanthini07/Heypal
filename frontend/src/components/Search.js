
import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"

export default function Search(){
    const navigate=useNavigate()
    const [search,setSearch]=useState([])
    const luser=JSON.parse(localStorage.getItem('user'))

    const fetchResults=async()=>{
        var userid=document.getElementById("userid").value.toLowerCase()
        if(!userid) return <p></p>
        return axios.post('http://localhost:8081/search',{id:userid}).then((res)=>{
            var results=res.data
            if(results.length){
            return (<div>
              {results.map((f)=>{
                  return (<div className="card" style={{width:"800px",marginBottom:"5px"}} onClick={()=>{
                    if(f.userid!==luser.userid) navigate('/profilepage/'+f.userid)
                    else navigate('/myprofile')}}>
                      <div className="card-body" style={{height:"70px"}}>
                      <img className="card-img-top"  src={"http://localhost:8081/"+f._id+".jpg"}
                     alt="pfp" style={{float:"left",width:"40px",borderRadius:"50%",marginRight:"10px",height:"40px",objectFit:"cover",objectPosition:"center center"}}/>
                      <p style={{marginTop:"5px"}}>{f.userid}</p>
                      </div>
                  </div>)})}
          </div>)}
          else{
            return (<div style={{marginTop:"100px"}}>
            <p style={{textAlign:"center"}}> No users found </p>
        </div>)
          }
        })
    }
    const fs=()=>{
        fetchResults().then((data)=>setSearch(data)).catch((err)=>console.log(err))
    }
    
    if(luser){
    return (<div>

            <form className='card' style={{width:"800px",marginBottom:"20px"}}>
              <input id='userid' type="text" className="form-control" placeholder="User ID" onKeyUp={fs} required/>
            </form>

        {search}
    </div>)}
    else{
      return <div style={{marginTop:"150px",padding:"15px"}}>
          <p style={{textAlign:"center"}}>Your session has expired.  <Link to={'/login'}>Login </Link> </p>
      </div>
  }
}