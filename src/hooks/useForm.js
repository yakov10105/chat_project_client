import { useState,useEffect } from "react";

const useForm = (validate)=>{
    const [values,setValues] = useState({});
    const [errors,setErrors] = useState({});

    const handleChange = (e)=>{
        const {name,value} = e.target
        setValues({
            ...values,
            [name]:value 
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        setErrors(validate(values))
    }

    return {handleChange,handleSubmit,errors,values}
}

export default useForm;