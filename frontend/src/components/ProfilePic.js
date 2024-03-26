import axios from "axios";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function ProfilePic() {
    const luser=JSON.parse(localStorage.getItem('user'))
    const navigate=useNavigate()

    const handleSubmit = async (event) => {
    event.preventDefault();
      
    let formData = new FormData(event.target)
    formData.append('uid',luser.userid)

    await axios.post("http://localhost:8081/changeprofile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(()=>{
        navigate('/editprofile')
    }).catch((err)=>{
        if(err.response.status===400){
          alert("Please select a picture")
      }
    })
    
}

  if(luser){
  return (
    <div style={{marginTop:"200px"}}>
      <div style={{backgroundColor:"black",margin:"10px auto",textAlign:"center",width:"500px",color:"white",padding:"5px",borderRadius:"5px"}}>
            Change Profile pic
        </div>
    <div className="card" style={{width:"500px"}}>
    <form id="postupload" name="postupload" onSubmit={handleSubmit} className="card-body">
      
      <input type="file" className="btn btn-secondary" style={{width:"450px"}} name="image" id="image" required/><br />
      <script defer src="https://cdn.crop.guide/loader/l.js?c=123ABC"></script>
      <button type="submit" className="btn btn-dark" style={{width:"450px"}} value="add post">Confirm</button>
    </form>
    </div>
    <div style={{width:"500px",margin:"5px auto",textAlign:"center",backgroundColor:"black",padding:"5px",color:"white",borderRadius:"5px"}} onClick={()=>navigate('/editprofile')} >Back to Edit Profile</div>
    </div>
  )}
  else{
    return <div style={{marginTop:"150px",padding:"15px"}}>
        <p style={{textAlign:"center"}}>Your session has expired.  <Link to={'/login'}>Login </Link> </p>
    </div>
}
}