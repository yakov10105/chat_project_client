import React, { useState} from 'react'
import './Login.css'
import { Container, Divider, Stack, TextField,Button } from '@mui/material'
import Line from '../../layouts/Line'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object().shape({
    userName:yup.string().required("* User Name is requierd"),
    password: yup.string().required("* Password is requierd").min(5,"* Password must be at least 5 characters")
});

const Login = () => {
    const [userName , setUserName ] = useState("")
    const [password , setPassword ] = useState("")
    const [isLoggedin , setIsLoggedIn ] = useState(false)
    const [user,setUser] = useState({})
    const [serverError , setServerError] = useState("")
    const {register, handleSubmit,setValue,formState, formState: { errors }} = useForm({resolver:yupResolver(schema)})

    const handleAutoFill = (e)=>{
        e.preventDefault();
        if(!formState.isDirty){
           setValue('userName',userName);
           setValue('password',password);
        }
        handleSubmit(sendRequest)();
    }
    const sendRequest = () =>{
        axios.post('http://localhost:8082/api/auth/login',{
            UserName: userName,
            Password: password
        }).then((res)=>{
            localStorage.setItem("key",res.data.key)
            setUser(res.data.user)
            setIsLoggedIn(true);
        }).catch((err)=>{
            if(err.response){
                setServerError(err.response.data.error)
            }
            else{
                console.log(err)
            }
        })
        
    }



    if (!isLoggedin) {
        return (
            <div className="Login">
               <Container maxWidth="sm" fixed="true" sx={{paddingLeft:"0px"}} className="data_container">
                   <Line justify="between">
               
               <div className="register">
                   <p style={{color:"#ffffff", marginBottom:"185px", textAlign:"center"}}>Dont have An Acount Yet?</p>
                            <Button className='sign-up_btn' component={Link} to="/signup" style={{
                                borderRadius: 35,
                                color: "#182418",
                                background: "#DBD582",
                                padding: "13px 26px" }} variant='contained' >SignUp</Button>
               </div>
               <form onSubmit={handleAutoFill}>
                    <Stack 
                        spacing={2}>
                            <p>Login</p>
                            <TextField 
                                name='userName'
                                className="field" 
                                id="outlined-basic" 
                                label="User Name" 
                                variant='outlined'
                                error={errors['userName']?.message}
                                helperText={errors['userName']?.message}
                                {...register('userName')} 
                                onChange={(e)=>{setUserName(e.target.value)}}/>
                            <TextField 
                                name='password'
                                className="field" 
                                id="outlined-basic" 
                                type='password'  
                                label="Password" 
                                variant="outlined"
                                error={errors['password']?.message || serverError }
                                helperText={errors['password']?.message} 
                                {...register('password')}
                                onChange={(e)=>{setPassword(e.target.value)}}/>
                            <Button className='login-btn'  variant='contained' style={{
                                borderRadius: 35,
                                background: "linear-gradient(60deg,  #5E9C2F,#5E9C2F)",
                                padding: "11px 22px" }} type='submit'>Login</Button>
                    </Stack>
                    
               </form>
                       
                       </Line>
               </Container>
            </div>
        )
    }
    else{
        return (<Redirect
            to={{
            pathname: "/chat",
            state: { user: user }
          }}
        />)
    }
}

export default Login
