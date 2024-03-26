import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
// import '../styles/Layout.css'

export default function Layout(){
  const luser=JSON.parse(localStorage.getItem('user'))
  const imagesToPreload = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];

  useEffect(()=>{
    imagesToPreload.forEach((src) => {
    const img = new Image();
    img.src = src;
  })}, [])

    return ( 
    <div>
      <nav className="navbar navbar-expand-md mb-4 topnav" id="myTopnav" style={{backgroundColor:"black"}}>
        <div className="collapse navbar-collapse" id="navbarCollapse" style={{justifyContent:"space-between"}}>
        
          <div className="navbar-nav" style={{float:"left",marginLeft:"20px"}}>
              <button className="nav-link"><Link className="nav-link" to={"/"} ><img src="logo.png" alt="Home" style={{width:"80px"}} /> </Link></button>
          </div>

          <div>
          <ul className="navbar-nav" style={{float:"left"}}>
          <li className="nav-item ">
            <button className="nav-link"><Link className="nav-link" to={"/"} ><img src="home.png" alt="Home" style={{width:"35px"}} /> </Link></button>
          </li>
          <li className="nav-item " style={{float:"right"}}>
            <button className="nav-link"><Link className="nav-link" to={"/search"}><img src="search.png" alt="Search" style={{width:"40px"}} /> </Link></button>
          </li>
          <li className="nav-item " style={{float:"right"}}>
            <button className="nav-link"><Link className="nav-link" to={"/post"}><img src="add-post.png" alt="Add Post" style={{width:"35px"}} /> </Link></button>
          </li>
          <li className="nav-item " style={{float:"right"}}>
            <button className="nav-link"><Link className="nav-link" to={"/myprofile"}><img src="user.png" alt="My Profile" style={{width:"35px"}} />  </Link></button>
          </li>
        </ul>
          </div>
      </div>
    </nav>
    {luser ? <Outlet/> : <div style={{marginTop:"150px",padding:"15px"}}>
            <p style={{textAlign:"center"}}>You need to login first!  <Link to={'/login'}>Login </Link> </p>
        </div>}
    </div>
    );
}