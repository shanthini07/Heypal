import { ErrorMessage, Field, Formik, Form } from "formik"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'

export default function EditProfile(){
    const navigate=useNavigate()
    const luser=JSON.parse(localStorage.getItem('user'))

    const removeProfile=async()=>{
        await axios.post('http://localhost:8081/removeprofile',{userid:luser.userid})
        alert("Profile pic removed")
    }

    const submitHandler = async(values, setSubmitting) => {

        if(values.name.length>0) 
            await axios.put('http://localhost:8081/changename',{userid:luser.userid,name:values.name})

        if(values.userid.length>0) await axios.put('http://localhost:8081/changeuserid',{userid:luser.userid,newuserid:values.userid}).then(async(data)=>{
            var user=await axios.post('http://localhost:8081/login',data.data)

            localStorage.removeItem('user');
            localStorage.setItem('user',JSON.stringify(user.data));
        })

        if(values.password.length>0) 
            await axios.put('http://localhost:8081/changepassword',{userid:luser.userid,password:values.password})
        
        if(values.bio.length>0){
            var freq=0;
            for(var i of values.bio){
                if(i===" ") freq++;
            }
            if(values.bio.length===freq){
                await axios.put('http://localhost:8081/changebio',{userid:luser.userid,bio:""})
            }else{
                await axios.put('http://localhost:8081/changebio',{userid:luser.userid,bio:values.bio})
            }
        }
        alert('Changes Saved');
        navigate('/myprofile')
    }
    const validator=async(values)=>{
        const errors={}
        var users=await axios.get('http://localhost:8081/getall')

        var user=users.data.filter((u)=>u.userid===values.userid)
        if(user.length>0) errors.userid="UserID already exists"

        var idcon = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/

        if(values.userid.length>0){
            if(!idcon.test(values.userid)) errors.userid="UserID can contain only alphabets, numbers, . or _"
        }

        if(values.userid.length>0){
            if(values.userid.indexOf('.')===0||values.userid.indexOf('.')===values.userid.length-1)
            errors.userid="UserID cannot start or end with ."
        }
        

        if(values.password && values.password.length<8) errors.password="Password should contain at least 8 characters"
        return errors
    }

    if(luser){
    return (<div style={{marginTop:"50px"}}>

        <div style={{backgroundColor:"black",margin:"10px auto",textAlign:"center",width:"18rem",color:"white",padding:"5px",borderRadius:"5px"}}>
            Edit Profile
        </div>

        <Formik initialValues={{name:"",email:"",password:"",userid:"",bio:""}} onSubmit={submitHandler} validate={validator}>
        {({ isSubmitting }) =>(
            <Form class="card bg-secondary" style={{width:"18rem"}}>

                <div class="form-group">
                    <Field class="form-control" type="text" name="name" placeholder="Change Name"/>
                    <ErrorMessage class="form-text text-muted" name="name" component="div" />
                </div>

                <div class="form-group" >
                    <Field class="form-control" type="text" name="userid" placeholder="Change User ID"/>
                    <ErrorMessage class="form-text text-muted" name="userid" component="div" />
                </div>

                <div class="form-group" >
                    <Field class="form-control" type="password" name="password" placeholder="Change Password"/>
                    <ErrorMessage class="form-text text-muted" name="password" component="div" />
                </div>

                <div class="form-group" >
                    <Field component="textarea" class="form-control" type="text" name="bio" placeholder="Change Bio. To remove, type empty spaces"/>
                </div>

                <div>
                <button class="btn" onClick={()=>{navigate('/profilepic')}} style={{marginBottom:"0px",width:"44%",float:"left",backgroundColor:"dodgerblue",color:"white"}}>
                    Change profile
                </button>

                <button class="btn" style={{marginBottom:"0px",width:"44%",float:"left",backgroundColor:"dodgerblue",color:"white"}} onClick={()=>removeProfile()} >
                    Remove Profile
                </button>
                </div>

                <button type="submit" class="btn btn-dark" disabled={isSubmitting} >
                    Save Changes
                </button>
            </Form>
        )}
        </Formik>
    </div>)}
    else{
        return <div style={{marginTop:"150px",padding:"15px"}}>
        <p style={{textAlign:"center"}}>Your session has expired. <Link to={'/login'}>Login </Link></p>
        </div>
    }
}