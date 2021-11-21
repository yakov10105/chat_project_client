import React, {useEffect, useContext } from 'react'
import { Form} from 'react-bootstrap';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import {UserTyping} from '../../Context/UserTyping';
import {RoomContext} from '../../Context/RoomContext';


const SendMessageForm = ({ sendMessage }) => {

    const [message, setMessage] = useState('');
    const {isTyping, setIsTyping} = useContext(UserTyping);
    const {roomName, setRoomName} = useContext(RoomContext);
    let timer = null;

    useEffect(()=>{
        return (() => clearTimeout(timer));
    },[])

    const userTyping = () => {
        clearTimeout(timer);
        setIsTyping(true)
        // console.log(isTyping)
        timer = setTimeout(() => {
            setIsTyping(false)
            // console.log(isTyping)
        }, 2000);
        
    }

    const handleOnChange = (e) =>{
        setMessage(e.target.value);
        userTyping();
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        sendMessage(message);
        setMessage('');
    }
    return(
        <Form
         onSubmit={handleSubmit}>
        <Grid container style={{padding: '20px'}}>
            <Grid item xs={11}>
                <TextField id="outlined-basic-email" label="Message" fullWidth 
                onChange={handleOnChange} value={message}/>
            </Grid>
            <Grid xs={1} align="right">
                <Fab color="primary" type='submit' aria-label="add" disabled={roomName==="room"}><SendIcon /></Fab>
            </Grid>
        </Grid>
        </Form>
    )
}

export default SendMessageForm;