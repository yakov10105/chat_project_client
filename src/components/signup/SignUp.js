import React , {useState}from 'react'
import { Container,Stack,TextField,Button } from '@mui/material'
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
        axios.post('http://localhost:8082/api/auth/login',{
            UserName: userDetails.UserName,
            Password: userDetails.Password
        }).then((res)=>{
            localStorage.setItem("key",res.data.key)
            setLoggedUser(res.data.user)
            setIsLoggedIn(true)
        }).catch((err)=>{
            console.log(err)
        })
    }
    const registerUser=()=>{
        axios.post('http://localhost:8082/api/auth/register',userDetails)
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
        <div className="Signup">
            <Container maxWidth="sm" fixed="true" className="container">
           <form onSubmit={handleAutoFill}>
                <Stack 
                    spacing={2}
                    className="stack"
                    >
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            label="First Name" 
                            variant='filled' 
                            name="FirstName" 
                            {...register('firstName')}
                            onChange={handleChange} />
                         <p>{errors['firstName']?.message}</p>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            label="Last Name" 
                            variant="filled" 
                            name="LastName" 
                            {...register('lastName')}
                            onChange={handleChange}/>
                         <p>{errors['lastName']?.message}</p>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            label="User Name" 
                            variant="filled" 
                            name='UserName' 
                            {...register('userName')}
                            onChange={handleChange}/>
                         <p>{errors['userName']?.message}</p>
                         {serverError.userNameError &&  <p>{serverError.userNameError}</p>}
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            type="email" 
                            label="Email" 
                            variant="filled" 
                            name='UserEmail' 
                            {...register('userEmail')}
                            onChange={handleChange}/>
                         <p>{errors['userEmail']?.message}</p>
                         {serverError.emailError &&  <p>{serverError.emailError}</p>}
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            type='number' 
                            label="Age" 
                            variant="filled" 
                            name="UserAge" 
                            {...register('userAge')}
                            onChange={handleChange}/>
                         <p>{errors['userAge']?.message}</p>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            type='password'  
                            label="Password" 
                            variant="filled" 
                            name="Password" 
                            {...register('password')}
                            onChange={handleChange}/>
                         <p>{errors['password']?.message}</p>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            type='password'  
                            label="Confirm Password" 
                            variant="filled"
                            name='ConfirmPassword'
                            {...register('confirmPassword')}/>
                         <p>{errors['confirmPassword']?.message}</p>
                        <Button color='primary' variant='outlined' type='submit' >Signup</Button>
                </Stack>
           </form>
           </Container>
        </div>
    )
   }
   else{
        return (<Redirect
            to={{
            pathname: "/caht",
            state: { user: loggedUser }
          }}
        />)
   }
}

export default SignUp
