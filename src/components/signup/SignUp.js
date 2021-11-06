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
            <Container maxWidth="sm" fixed="true" className="data_container">
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
                            error={errors['firstName']?.message != null}
                            helperText={errors['firstName']?.message}
                            {...register('firstName')}
                            onChange={handleChange} />
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            label="Last Name" 
                            variant="filled" 
                            name="LastName" 
                            error={errors['lastName']?.message}
                            helperText={errors['lastName']?.message}
                            {...register('lastName')}
                            onChange={handleChange}/>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            label="User Name" 
                            variant="filled" 
                            name='UserName' 
                            error={errors['userName']?.message || serverError.userNameError}
                            helperText={errors['userName']?.message || serverError.userNameError}
                            {...register('userName')}
                            onChange={handleChange}/>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            type="email" 
                            label="Email" 
                            variant="filled" 
                            name='UserEmail'
                             error={errors['userEmail']?.message || serverError.emailError}
                            helperText={errors['userEmail']?.message || serverError.emailError}
                            {...register('userEmail')}
                            onChange={handleChange}/>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            type='number' 
                            label="Age" 
                            variant="filled" 
                            name="UserAge" 
                            error={errors['userAge']?.message}
                            helperText={errors['userAge']?.message}
                            {...register('userAge')}
                            onChange={handleChange}/>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            type='password'  
                            label="Password" 
                            variant="filled" 
                            name="Password" 
                            error={errors['password']?.message}
                            helperText={errors['password']?.message}
                            {...register('password')}
                            onChange={handleChange}/>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            type='password'  
                            label="Confirm Password" 
                            variant="filled"
                            name='ConfirmPassword'
                            error={errors['confirmPassword']?.message}
                            helperText={errors['confirmPassword']?.message}
                            {...register('confirmPassword')}/>
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
