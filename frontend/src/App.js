import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import MyProfile from './components/MyProfile'
import Following from './components/Following';
import Followers from './components/Followers'
import ProfilePage from './components/ProfilePage';
import Search from './components/Search';
import Post from './components/Post';
import EditProfile from './components/EditProfile';
import ProfilePic from './components/ProfilePic'
import Likedby from './components/Likedby';
import EmailVerification from './components/EmailVerification';
import OTPVerification from './components/OTPVerification'
import { OTP } from './context/OTPverify'
import { useEffect, useState } from 'react';

function App() {
  const [otp,setotp]=useState(OTP)
  
  return (
    <div>
      <BrowserRouter>
          <Routes>
          <Route path='/' element={<Layout />} >
              <Route path="/home" element={<Home/>} />
              <Route path="/myprofile" element={<MyProfile/>} />
              <Route path="/profilepage/:oid" element={<ProfilePage/>} />
              <Route path="/search" element={<Search/>} />
              <Route path="/post" element={<Post/>} />
              <Route path="/editprofile" element={<EditProfile/>} />
              <Route path="/likedby/:pid" element={<OTP.Provider value={[otp,setotp]}><Likedby/></OTP.Provider>} />
          </Route>
          <Route path="/emailverification" element={<OTP.Provider value={[otp,setotp]}><EmailVerification/></OTP.Provider> } />
          <Route path="/otpverification" element={<OTP.Provider value={[otp,setotp]}><OTPVerification/></OTP.Provider>} />
          <Route path="/signup" element={<OTP.Provider value={[otp,setotp]}><SignUp/></OTP.Provider>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/profilepic" element={<ProfilePic/>} />
            <Route path="/following/:fid" element={<Following/>} />
            <Route path="/followers/:fid" element={<Followers/>} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
