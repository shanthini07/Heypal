import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'


export default function Login(){
    const navigate=useNavigate()

    const submitHandler =async (values, setSubmitting) => {
        var user=await axios.post('http://localhost:8081/user',values)
        if(user.data.password!==values.password) alert('Invalid password')
        else{
            var ouser=await axios.post('http://localhost:8081/login',values)
            localStorage.setItem('user',JSON.stringify(ouser.data));
            navigate('/')
        }
    }
    const validator=async(values)=>{
        const errors={}
        var users=await axios.get('http://localhost:8081/getall')
        
        if(!values.userid) errors.userid="Please enter User ID"
        if(!values.password) errors.password="Please enter password"

        var user=users.data.filter((u)=>u.userid===values.userid)
        if(user.length<1) errors.userid="UserID doesn't exist"
        
        return errors
    }
    return (<div style={{marginTop:"230px"}}>

        <div style={{backgroundColor:"black",margin:"10px auto",textAlign:"center",width:"18rem",color:"white",padding:"5px",borderRadius:"5px"}}>
            Login
        </div>

        <Formik initialValues={{password:"",userid:""}} onSubmit={submitHandler} validate={validator}>
        {({ isSubmitting }) =>(
            <Form class="card bg-secondary" style={{width:"18rem"}}>

                <div class="form-group" >
                    <Field class="form-control" type="text" name="userid" placeholder="Enter User ID"/>
                    <ErrorMessage class="form-text text-muted" name="userid" component="div" />
                </div>

                <div class="form-group" >
                    <Field class="form-control" type="password" name="password" placeholder="Enter Password"/>
                    <ErrorMessage class="form-text text-muted" name="password" component="div" />
                </div>
                
                <button type="submit" class="btn btn-dark" disabled={isSubmitting}>
                   Login
                </button>
            </Form>
        )}
        </Formik>
        <p style={{margin:"10px auto",textAlign:"center"}}>
            Don't have an account? <Link to={'/emailverification'}> Sign Up </Link>
        </p>
    </div>)
}