import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useContext } from "react";
import { OTP } from "../context/OTPverify"

export default function OTPVerification(){
    const navigate=useNavigate()
    const [otp,setotp]=useContext(OTP)

    const submitHandler = async(values, setSubmitting) => {
        if(otp[0]===values.otp){
            navigate("/signup")
        }
        else{
            alert("invalid otp")
        }
    }

    if(otp[0]){
    return (<div style={{marginTop:"180px"}}>

        <div style={{backgroundColor:"black",margin:"10px auto",textAlign:"center",width:"18rem",color:"white",padding:"5px",borderRadius:"5px"}}>
            OTP verification
        </div>

        <Formik initialValues={{otp:""}} onSubmit={submitHandler} >
        {({ isSubmitting }) =>(
            <Form class="card bg-secondary" style={{width:"18rem"}}>
                <div class="form-group">
                    <Field class="form-control" type="text" name="otp" placeholder="Enter OTP"/>
                    <ErrorMessage class="form-text text-muted" name="text" component="div" />
                </div>

                <button type="submit" class="btn btn-dark" disabled={isSubmitting} >
                    Verify OTP
                </button> 
             
            </Form>
        )}
        </Formik>
        <p style={{margin:"10px auto",textAlign:"center"}}>We've sent you an OTP to your email. Please check the spam folder.</p>
        <p style={{margin:"10px auto",textAlign:"center"}}>
            Use different email?<Link to={'/emailverification'}>click here</Link>
        </p>
        
    </div>)}
    else{
        return <div style={{marginTop:"300px",padding:"15px"}}>
            <p style={{textAlign:"center"}}>Enter your email first.  <Link to={'/emailverification'}>Click here </Link> </p>
        </div>
    }
}