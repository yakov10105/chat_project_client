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

const Chat = ({messages,chatFlag, sendMessage,joinRoom, closeConnection,user, gameFlag}) =>{
  const [isTyping, setIsTyping] = useState(false);
  const classes = useStyles();

  
  const value = useMemo(() => ({isTyping, setIsTyping}), [isTyping, setIsTyping])

  const renderChat = ()=>{
    if(chatFlag){
      return(
        <UserTyping.Provider value={value}>
        <Grid item xs={9}>
          <MessageContainer messages = {messages} user={user} />
          <SendMessageForm sendMessage={sendMessage}  />
        </Grid>
          </UserTyping.Provider>
      )
    }
    else{
      return (<div>Not </div>)
    }
  }


  return (
      <div>
      <UserTyping.Provider value={value}>
        <Grid container component={Paper} className={classes.chatSection}>
            <ConnectedUsers closeConnection={closeConnection} user={user} joinRoom={joinRoom} gameFlag={gameFlag}/>
            {renderChat()}
        </Grid>
      </UserTyping.Provider>
    </div>
  )
}

export default Chat;