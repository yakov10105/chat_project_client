import React , {useState}from 'react'
import {Container, Stack, TextField, Button, Grid, Typography, Box   } from '@mui/material'
import Logo from'../../assets/GameIcon.svg'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Redirect } from 'react-router'
import './SignUp.css';

const schema = yup.object().shape({
    firstName: yup.string().required("* First Name is requierd"),
    lastName:yup.string().required("* Last Name is requierd"),
    userName:yup.string().required("* User Name is requierd"),
    userEmail:yup.string().email("* Email nust be valid").required("* Email is requierd"),
    userAge:yup.string().required("* Age is required"),
    password: yup.string().required("* Password is requierd").min(5, '* Password must be at least 5 characters'),
    confirmPassword: yup.string().required('* Confirm Password is required').oneOf([yup.ref('password')], '* Passwords must match')
});

const SignUp = () => {

    const [serverError,setServerError] = useState({})
    const [userDetails,setUserDetails] = useState({})
    const [isLoggedIn,setIsLoggedIn] = useState(false)
    const [ loggedUser , setLoggedUser]=useState({})
    const {register, handleSubmit,setValue,formState, formState: { errors }} = useForm({
        resolver:yupResolver(schema)
    })

    const handleAutoFill = (e)=>{
        e.preventDefault();
        if(!formState.isDirty){
           setValue("firstName",userDetails.firstName);
           setValue("lastName",userDetails.lastName);
           setValue("userName",userDetails.userName);
           setValue("userEmail",userDetails.userEmail);
           setValue("userAge",userDetails.userAge);
           setValue("password",userDetails.password);
        }
        handleSubmit(registerUser)();
    }
    const loginAfterRegistering = ()=>{
        axios.post('https://chat-project-server.azurewebsites.net/api/auth/login',{
            UserName: userDetails.userName,
            Password: userDetails.password
        }).then((res)=>{
            localStorage.setItem("key",res.data.key)
            setLoggedUser(res.data.user)
            setIsLoggedIn(true)
        }).catch((err)=>{
            console.log(err)
        })
    }
    const registerUser=()=>{
        axios.post('https://chat-project-server.azurewebsites.net/api/auth/register',userDetails)
        .then((res)=>{
            console.log(res.data)
            loginAfterRegistering();
        })
        .catch((err)=>{
           if(err.response){
                if(err.response.data.userNameError){
                    setServerError({userNameError:err.response.data.userNameError})
                }
                if(err.response.data.emailError){
                    setServerError({emailError:err.response.data.emailError})
                }
           }
           else{
               console.log(err)
           }
        })
    }
    const handleChange =(e)=>{
        setServerError({})
        const {name , value} = e.target;
        setUserDetails(prevState=>({
            ...prevState,
            [name]:value
        }));
    };

   if(!isLoggedIn){
    return (
            <div  className="data_container">
           <form className="stack"  onSubmit={handleAutoFill} >
                    <Grid container padding={3} spacing={2} justifyContent="center" alignItems="center">
                        <Grid container justifyContent="space-between" alignItems="center">
                            
                    <Grid item xs={1} sm={4}  md="auto" lg="auto">
                            <img src={Logo} width="100" alt="Shesh Logo" />
                    </Grid>
                    <Grid item xs={6} sm={4} md="auto">
                    <Typography variant="h3">
                        Sign Up
                    </Typography>
                    </Grid>
                    <Box component={Grid}  item xs={3} md="auto" justifyContent="flex-end" alignItems="center" display={{ xs: "none", sm: "flex" }}>
                        <Grid item sm="auto" md="auto">
                            <img src={Logo} width="100" alt="Shesh Logo" />
                        </Grid>
                    </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                        <TextField  
                            className="field" 
                            fullWidth
                            id="outlined-basic" 
                            label="First Name" 
                            variant='outlined' 
                            name="FirstName" 
                            error={errors['firstName']?.message != null}
                            helperText={errors['firstName']?.message}
                            {...register('firstName')}
                            onChange={handleChange} />
                        </Grid>

                        <Grid item xs={12} md={8}>
                        <TextField  
                            className="field" 
                            fullWidth
                            id="outlined-basic" 
                            label="Last Name" 
                            variant="outlined" 
                            name="LastName" 
                            error={errors['lastName']?.message}
                            helperText={errors['lastName']?.message}
                            {...register('lastName')}
                            onChange={handleChange}/>
                        </Grid>
                        
                        

                        <Grid item xs={12} md={8}>
                        <TextField  
                            className="field" 
                            fullWidth
                            id="outlined-basic" 
                            label="User Name" 
                            variant="outlined" 
                            name='UserName' 
                            error={errors['userName']?.message || serverError.userNameError}
                            helperText={errors['userName']?.message || serverError.userNameError}
                            {...register('userName')}
                            onChange={handleChange}/>
                        </Grid>

                        <Grid item xs={12} md={4}>
                        <TextField  
                            className="field" 
                            fullWidth
                            id="outlined-basic" 
                            type='number' 
                            label="Age" 
                            variant="outlined" 
                            name="UserAge" 
                            error={errors['userAge']?.message}
                            helperText={errors['userAge']?.message}
                            {...register('userAge')}
                            onChange={handleChange}/>
                        </Grid>
                        
                        <Grid item xs={12}>
                        <TextField  
                            className="field" 
                            fullWidth
                            id="outlined-basic" 
                            type="email" 
                            label="Email" 
                            variant="outlined" 
                            name='UserEmail'
                             error={errors['userEmail']?.message || serverError.emailError}
                            helperText={errors['userEmail']?.message || serverError.emailError}
                            {...register('userEmail')}
                            onChange={handleChange}/>
                        </Grid>

                        <Grid item xs={12}>
                        <TextField  
                            className="field" 
                            fullWidth
                            id="outlined-basic" 
                            type='password'  
                            label="Password" 
                            variant="outlined" 
                            name="Password" 
                            error={errors['password']?.message}
                            helperText={errors['password']?.message}
                            {...register('password')}
                            onChange={handleChange}/>
                        </Grid>

                        <Grid item xs={12}>
                        <TextField  
                            className="field" 
                            fullWidth
                            id="outlined-basic" 
                            type='password'  
                            label="Confirm Password" 
                            variant="outlined"
                            name='ConfirmPassword'
                            error={errors['confirmPassword']?.message}
                            helperText={errors['confirmPassword']?.message}
                            {...register('confirmPassword')}/>
                        </Grid>

                        <Grid container padding={2}  justifyContent="space-between" alignItems="center">
                            
                    <Box component={Grid}  item xs={3} md="auto" justifyContent="flex-end" alignItems="center" display={{ xs: "none", sm: "flex" }}>
                        <Grid item sm="auto" md="auto">
                            <img src={Logo} width="100" alt="Shesh Logo" />
                        </Grid>
                    </Box>
                    <Grid item xs={6} sm={4} md={6}>
                    <Button variant='contained' style={{
                                borderRadius: 35,
                                background: "linear-gradient(60deg,  #5E9C2F,#5E9C2F)",
                                padding: "15px 30px", width:"100%" }} type='submit' >Signup
                                </Button>
                    </Grid>
                    
                    <Grid item xs={5} sm={4} md="auto">
                            <img src={Logo} width="100" alt="Shesh Logo" />
                    </Grid>
                        </Grid>
                    </Grid>
           </form>
           </div>
    )
   }
   else{
        return (<Redirect
            to={{
            pathname: "/app",
            state: { user: loggedUser }
          }}
        />)
   }
}

export default SignUp
