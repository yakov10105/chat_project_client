import React , {useState}from 'react'
import { Container,Stack,Divider,TextField,Button } from '@mui/material'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import './SignUp.css';

const schema = yup.object().shape({
    firstName: yup.string().required("* First Name is requierd"),
    lastName:yup.string().required("* Last Name is requierd"),
    userName:yup.string().required("* User Name is requierd"),
    email:yup.string().email("* Email nust be valid").required("* Email is requierd"),
    age:yup.number().required("* Age is required"),
    password: yup.string().required("* Password is requierd").min(5, '* Password must be at least 5 characters'),
    confirmPassword: yup.string().required('* Confirm Password is required').oneOf([yup.ref('password')], '* Passwords must match')
});

const SignUp = () => {
    const [userDetails,setUserDetails] = useState({})
    const {register, handleSubmit, formState: { errors }} = useForm({
        resolver:yupResolver(schema)
    })


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

    const registerUser=()=>{
        axios.post('http://localhost:3495/api/auth/register',userDetails)
        .then((res)=>{
            console.log(res.data)
            loginAfter();
        }).catch((err)=>{
            console.log(err)
        })
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
           <form onSubmit={handleSubmit(registerUser)}>
                <Stack 
                    spacing={2}
                    divider={<Divider orientation="horizontal" flexItem />}
                    >
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            label="First Name" 
                            variant='filled' 
                            name="FirstName" 
                            onChange={handleChange}
                            {...register('firstName')} />
                         <p>{errors['firstName']?.message}</p>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            label="Last Name" 
                            variant="filled" 
                            name="LastName" 
                            onChange={handleChange}
                            {...register('lastName')}/>
                         <p>{errors['lserName']?.message}</p>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            label="User Name" 
                            variant="filled" 
                            name='UserName' 
                            onChange={handleChange}
                            {...register('userName')}/>
                         <p>{errors['userName']?.message}</p>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            type="email" 
                            label="Email" 
                            variant="filled" 
                            name='Email' 
                            onChange={handleChange}
                            {...register('email')}/>
                         <p>{errors['email']?.message}</p>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            type='number' 
                            label="Age" 
                            variant="filled" 
                            name="Age" 
                            onChange={handleChange}
                            {...register('age')}/>
                         <p>{errors['age']?.message}</p>
                        <TextField  
                            className="field" 
                            id="outlined-basic" 
                            type='password'  
                            label="Password" 
                            variant="filled" 
                            name="Password" 
                            onChange={handleChange}
                            {...register('password')}/>
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

export default SignUp
