import { ErrorMessage, Field, Form, Formik } from "formik";
import '../styles/SignUp.css'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { OTP } from "../context/OTPverify";
import { useContext } from "react";

export default function SignUp(){
    const navigate=useNavigate()
    const [otp,setotp]=useContext(OTP)

    const submitHandler = async(values, setSubmitting) => {
        
        if(otp[0]){
            values.userid.toLowerCase()

        var newuser={
            email:otp[1],
            name:values.name,
            userid:values.userid,
            password:values.password
        }

        await axios.post('http://localhost:8081/signup',newuser)
        
        var ouser=await axios.post('http://localhost:8081/login',newuser)
        localStorage.setItem('user',JSON.stringify(ouser.data));
        navigate('/')
        }
        else{
            alert('You have not verified your email')
            navigate('/emailverification')
        }
        
    }
    const validator=async(values)=>{
        const errors={}
        var users=await axios.get('http://localhost:8081/getall')

        if(!values.name) errors.name="Please enter a name"
        if(!values.userid) errors.userid="Please create an User ID"
        if(!values.password) errors.password="Please create a password"

        var user=users.data.filter((u)=>u.userid===values.userid)
        if(user.length>0) errors.userid="UserID already exists"

        var idcon = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/

        if(!idcon.test(values.userid)) errors.userid="UserID can contain only alphabets, numbers, . or _"

        if(values.userid.indexOf('.')===0||values.userid.indexOf('.')===values.userid.length-1)
        errors.userid="UserID cannot start or end with ."

        if(values.password.length<8) errors.password="Password should contain at least 8 characters"
        return errors
    }


    return (<div style={{marginTop:"180px"}}>

        <div style={{backgroundColor:"black",margin:"10px auto",textAlign:"center",width:"18rem",color:"white",padding:"5px",borderRadius:"5px"}}>
            Signup
        </div>

        <Formik initialValues={{name:"",password:"",userid:""}} onSubmit={submitHandler} validate={validator}>
        {({ isSubmitting }) =>(
            <Form class="card bg-secondary" style={{width:"18rem"}}>

                <div class="form-group">
                    <Field class="form-control" type="text" name="name" placeholder="Enter Name"/>
                    <ErrorMessage class="form-text text-muted" name="name" component="div" />
                </div>

                <div class="form-group" >
                    <Field class="form-control" type="text" name="userid" placeholder="Create An User ID"/>
                    <ErrorMessage class="form-text text-muted" name="userid" component="div" />
                </div>

                <div class="form-group" >
                    <Field class="form-control" type="password" name="password" placeholder="Create Password"/>
                    <ErrorMessage class="form-text text-muted" name="password" component="div" />
                </div>
                
                <button type="submit" class="btn btn-dark" disabled={isSubmitting} >
                    Create account
                </button>
                
             
            </Form>
        )}
        </Formik>
        <p style={{margin:"10px auto",textAlign:"center"}}>
            Already have an account? <Link to={'/login'}>Login</Link>
        </p>
    </div>)
}