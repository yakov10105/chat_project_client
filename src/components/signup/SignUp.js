import React , {useState}from 'react'
import { Container,Stack,Divider,TextField,Button } from '@mui/material'
import axios from 'axios'
import './SignUp.css';

const SignUp = () => {
    const [userDetails,setUserDetails] = useState({})
    const [confirmPassword,setConfirmPassword] = useState("")

    const validatePassword = ()=>{
        if(confirmPassword===userDetails.Password){return true}
        else return false
    }

    const loginAfter = ()=>{
        axios.post('http://localhost:3495/api/auth/login',{
            UserName: userDetails.UserName,
            Password: userDetails.Password
        }).then((res)=>{
            localStorage.setItem("key",res.data.key)
            axios.get("http://localhost:3495/api/auth/user",{
                headers:{
                    "Authorization": localStorage.getItem("key")
                }
            }).then((res)=>{
                console.log(res)
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    const register=()=>{
        if(validatePassword){
            axios.post('http://localhost:3495/api/auth/register',userDetails)
            .then((res)=>{
                console.log(res.data)
                loginAfter();
            }).catch((err)=>{
                console.log(err)
            })
        }
    }

    const handleChange =(e)=>{
        const {name , value} = e.target;
        setUserDetails(prevState=>({
            ...prevState,
            [name]:value
        }));
    };

    return (
        <div className="Signup">
            <Container maxWidth="sm" fixed="true" className="container">
            <Stack 
                spacing={2}
                divider={<Divider orientation="horizontal" flexItem />}
                >
                    <TextField  className="field" id="outlined-basic" label="First Name" variant='filled' name="FirstName" onChange={handleChange} />
                    <TextField  className="field" id="outlined-basic" label="Last Name" variant="filled" name="LastName" onChange={handleChange}/>
                    <TextField  className="field" id="outlined-basic" label="User Name" variant="filled" name='UserName' onChange={handleChange}/>
                    <TextField  className="field" id="outlined-basic" type="email" label="Email" variant="filled" name='Email' onChange={handleChange}/>
                    <TextField  className="field" id="outlined-basic" type='number' label="Age" variant="filled" name="Age" onChange={handleChange}/>
                    <TextField  className="field" id="outlined-basic" type='password'  label="Password" variant="filled" name="Password" onChange={handleChange}/>
                    <TextField  className="field" id="outlined-basic" type='password'  label="Confirm Password" variant="filled" onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
                    <Button color='primary' variant='outlined' onClick={register} >Signup</Button>
            </Stack>
           </Container>
        </div>
    )
}

export default SignUp
