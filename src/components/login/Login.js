import React, { useState} from 'react'
import './Login.css'
import { Container, Divider, Stack, TextField,Button } from '@mui/material'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'

const Login = () => {
    const [userName , setUserName ] = useState("")
    const [password , setPassword ] = useState("")
    const [isLoggedin , setIsLoggedIn ] = useState(false)


    const sendDetails = () =>{
        axios.post('http://localhost:8082/api/auth/login',{
            UserName: userName,
            Password: password
        }).then((res)=>{
            localStorage.setItem("key",res.data.key)
            setIsLoggedIn(true);
        }).catch((err)=>{
            console.log(err)
        })
        
    }



    if (!isLoggedin) {
        return (
            <div className="Login">
               <Container maxWidth="sm" fixed="true" className="container">
                <Stack 
                    spacing={2}
                    divider={<Divider orientation="horizontal" flexItem />}
                    >
                        <TextField className="field" id="outlined-basic" label="User Name" variant='filled' onChange={(e)=>{setUserName(e.target.value)}} />
                        <TextField className="field" id="outlined-basic" type='password'  label="Password" variant="filled" onChange={(e)=>{setPassword(e.target.value)}}/>
                        <Button className='login-btn'  variant='outlined' onClick={sendDetails}>Login</Button>
                        <Link className="signup-link" to="/signup">Dont have account ? click here to sign-up</Link>
                </Stack>
               </Container>
            </div>
        )
    }
    else{
        return (<Redirect to="/chat"/>)
    }
}

export default Login
