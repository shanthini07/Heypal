import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useContext } from "react";
import { OTP } from "../context/OTPverify"

export default function EmailVerification(){
    const navigate=useNavigate()
    const [otp,setotp]=useContext(OTP)

    const generateOTP=()=>{
        const random = Math.random()
        return Math.floor(100000 + random * (999999 - 100000))
    }

    const submitHandler = async(values, setSubmitting) => {
        var otpass=String(generateOTP())
        
        var status=await axios.post('http://localhost:8081/sendEmail',{
            to:values.email,
            subject:"Email verification",
            text:"Your One time Password is generated",
            html:'<div style="text-align:center;border-radius:5px;box-shadow:5px 5px 5px black;background-color:white;padding:10px"><p>Here is your One Time Password to signup</p><b style="color:blue">'+otpass+'</b><p>Copy the above password and paste it on the verify page</p><p><b>Note:</b>Your OTP will expire if you refresh the verification page</p> </div>'
        })
        if(status.data==="success"){
            setotp([otpass,values.email])
            navigate('/otpverification')
        }
        else{
            alert("Could not send email")
        }
        
    }

    const validator=async(values)=>{
        const errors={}
        var users=await axios.get('http://localhost:8081/getall')

        if (!values.email){
            errors.email = "Required";
        }
        else if (
           values.email.indexOf("@")<0 || values.email.indexOf("@")>values.email.lastIndexOf(".")
        ){
            errors.email = "Invalid email address";
        }

        if(!values.email) errors.email="Please add an email"
    
        var user=users.data.filter((u)=>u.email===values.email)
        if(user.length>0) errors.email="Email already exists"

        return errors
    }


    return (<div style={{marginTop:"180px"}}>

        <div style={{backgroundColor:"black",margin:"10px auto",textAlign:"center",width:"18rem",color:"white",padding:"5px",borderRadius:"5px"}}>
            Verify Email
        </div>

        <Formik initialValues={{email:""}} onSubmit={submitHandler} validate={validator}>
        {({ isSubmitting }) =>(
            <Form class="card bg-secondary" style={{width:"18rem"}}>
                <p style={{margin:"10px auto",textAlign:"center",color:"white"}}>Verify email to create new account</p>
                <div class="form-group">
                    <Field class="form-control" type="email" name="email" placeholder="Enter email address"/>
                    <ErrorMessage class="form-text text-muted" name="email" component="div" />
                </div>

                <button type="submit" class="btn btn-dark" disabled={isSubmitting} >
                    Send Email
                </button> 
             
            </Form>
        )}
        </Formik>
        <p style={{margin:"10px auto",textAlign:"center"}}>Please check your email before submitting</p>
        <p style={{margin:"10px auto",textAlign:"center"}}>
            Already have an account? <Link to={'/login'}>Login</Link>
        </p>
    </div>)
}