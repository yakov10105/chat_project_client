import './logout.css'
import {Button} from '@mui/material'
import React, { useState, useContext } from 'react'
import { Redirect } from 'react-router';
import {AccountConnection} from '../../ConnectionContext/AccountConnection';

const LogoutButton = () => {
    const [isLoggedIn,setIsLoggedIn] = useState(true)
    const {accountConnection, setAccountConnection} = useContext(AccountConnection);

    const closeConnection = async () => {
        try{
        // //   localStorage.removeItem("key");
          await accountConnection.stop();
        //   setAccountConnection();
          setIsLoggedIn(false)
        } catch(e){
          console.log(e);
        }
      }
    return (
        <div className='logout'>
            <Button  onClick={closeConnection} color="inherit" >Logout</Button>
            {(!isLoggedIn) &&
                <Redirect to="/"/>
            }
        </div>
    )
}

export default LogoutButton