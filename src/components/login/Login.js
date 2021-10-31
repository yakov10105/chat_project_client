import React, { useState} from 'react'
import './Login.css'
import { Container, Divider, Stack, TextField,Button } from '@mui/material'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
import useForm from '../../hooks/useForm'
import loginValidateInfo from '../../hooks/LoginValidateInfo'


const Login = () => {
    const [isLoggedin , setIsLoggedIn ] = useState(false)
    const {handleChange,handleSubmit,errors,values} = useForm(loginValidateInfo);
    
    const loginServer = () =>{
        axios.post('http://localhost:8082/api/auth/login',{
            UserName: values.userName,
            Password: values.Password
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
                        <form onSubmit={handleSubmit}>
                            <Stack 
                                spacing={2}
                                divider={<Divider orientation="horizontal" 
                                flexItem />}>
                                        <TextField 
                                            className="field" 
                                            id="outlined-basic"
                                            label="User Name" 
                                            name="userName"
                                            variant='filled' 
                                            value={values.userName}
                                            onChange={handleChange} />
                                        {errors.userName && <p className='errorMsg'>{errors.userName}</p>}
                                        <TextField
                                            className="field"
                                            id="outlined-basic" 
                                            type='password' 
                                            name="password"  
                                            label="Password" 
                                            value={values.password} 
                                            variant="filled" 
                                            onChange={handleChange}/>
                                        {errors.password && <p className='errorMsg'>{errors.password}</p>}
                                        <Button className='login-btn'
                                            type='submit' 
                                            variant='outlined' >Login</Button>
                                    <Link className="signup-link" to="/signup">Dont have account ? click here to sign-up</Link>
                            </Stack>
                        </form>
                   </Container>
                </div>
            )
    }
    else{
        return (<Redirect to="/chat"/>)
    }
}

export default Login
