import { useState,useEffect } from "react";

const useForm = ()=>{
    const [values,setValues] = useState({});
    const [errors,setErrors] = useState({});

    const handleChange = (e)=>{
        const {name,value} = e.target
        setValues({
            ...values,
            name:value 
        })
    }
}