import{ useEffect , useContext, useState, useMemo } from "react";
import  MessageContainer  from "./MessageContainer";
import  SendMessageForm  from "./SendMessageForm";
import  ConnectedUsers  from "./ConnectedUsers";
import Paper from '@material-ui/core/Paper';
import {Button} from '@mui/material';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import useStyles from "./hooks/useStyles";
import {UserTyping} from '../../Context/UserTyping';

const Chat = ({messages,chatFlag, sendMessage, roomName,joinRoom, closeConnection,user}) =>{
  const [isTyping, setIsTyping] = useState(false);
  const classes = useStyles();

  
  const value = useMemo(() => ({isTyping, setIsTyping}), [isTyping, setIsTyping])


  const renderChat = ()=>{
    if(chatFlag){
      return(
        <UserTyping.Provider value={value}>
        <Grid item xs={9}>
          <MessageContainer messages = {messages} user={user} />
          <SendMessageForm sendMessage={sendMessage}  roomName={roomName}/>
        </Grid>
          </UserTyping.Provider>
      )
    }
    else{
      return <h1>Not connected to room</h1>
    }
  }


  return (
      <div>
      <UserTyping.Provider value={value}>
        <Grid container component={Paper} className={classes.chatSection}>
            <ConnectedUsers closeConnection={closeConnection} user={user} joinRoom={joinRoom}/>
            {renderChat()}
        </Grid>
          </UserTyping.Provider>
    </div>
  )
}

export default Chat;