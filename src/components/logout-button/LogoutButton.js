import './logout.css'
import {Button} from '@mui/material'
import React, { useState } from 'react'
import { Redirect } from 'react-router';

const LogoutButton = () => {
    const [isLoggedIn,setIsLoggedIn] = useState(true)

    const handleClick=()=>{
        localStorage.removeItem("key");
        setIsLoggedIn(false)
    }
    return (
        <div className='logout'>
            <Button  onClick={handleClick}  variant='contained' style={{
                                borderRadius: 35,
                                background: "linear-gradient(60deg,  #5E9C2F,#5E9C2F)",
                                padding: "11px 22px" }}>Logout</Button>
            {(!isLoggedIn) &&
                <Redirect to="/"/>
            }
        </div>
    )
}

export default LogoutButton