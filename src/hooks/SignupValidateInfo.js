export default function signUpValidateInfo(values){
    let errors = {}
    if(!values.userName){
        errors.userName= "* Username Required."
    }
    if(!values.password){
        errors.password = "* Password Required."
    }else if(values.password.length<5){
        errors.password = "* Password too short."
    }

    return errors;

}