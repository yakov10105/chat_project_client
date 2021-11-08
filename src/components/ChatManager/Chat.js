import  MessageContainer  from "./MessageContainer";
import  SendMessageForm  from "./SendMessageForm";
import  ConnectedUsers  from "./ConnectedUsers";
import Paper from '@material-ui/core/Paper';
import {Button} from '@mui/material';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import useStyles from "./hooks/useStyles";
import{ useEffect , useState } from "react";

const Chat = ({messages,chatFlag, sendMessage, roomName,joinRoom, closeConnection,user}) =>{
  const classes = useStyles();
  
  const renderChat = ()=>{
    if(chatFlag){
      return(
        <Grid item xs={9}>
          <MessageContainer messages = {messages} user={user} />
          <SendMessageForm sendMessage={sendMessage}  roomName={ roomName} />
        </Grid>
      )
    }
    else{
      return <h1>Not connected to room</h1>
    }
  }


  return (
      <div>
        <div className="leave-room">
              <Button variant="contained" onClick={() => closeConnection(user)}>Leave Room</Button>
        </div>
        <Grid container>
              <Grid item xs={12} >
                  <Typography variant="h5" className="header-message">Chat</Typography>
              </Grid>
        </Grid>
        <Grid container component={Paper} className={classes.chatSection}>
            <ConnectedUsers user={user} joinRoom={joinRoom}/>
            {renderChat()}
        </Grid>
    </div>
  )
}

export default Chat;