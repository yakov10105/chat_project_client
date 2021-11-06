import React from 'react'
import { Route,Redirect } from 'react-router'

const ProtectedRoute = ({component : Component , ...rest}) => {

    const isAuthOnServer = ()=>{
        //call the server the validate the authorization key
    }

    return (
        <Route 
            {...rest} 
            render={
            (props)=>{
                if(localStorage.getItem('key')){
                    if(isAuthOnServer){
                        return <Component {...props}/>
                    }
                }
                else{
                    return <Redirect to="/unauthorized"/>
                }
            }
        }   
        />
    )
}

export default ProtectedRoute
