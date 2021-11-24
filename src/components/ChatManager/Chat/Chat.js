import{ useEffect , useContext, useState, useMemo } from "react";
import  MessageContainer  from "../MessageContainer/MessageContainer";
import  SendMessageForm  from "../SendMessageForm/SendMessageForm";
import Grid from '@material-ui/core/Grid'
import Style from "./Style";
import {UserTyping} from '../../../Context/UserTyping';

const Chat = ({messages, user}) =>{
  const [isTyping, setIsTyping] = useState(false);
  const classes = Style();

  
  const value = useMemo(() => ({isTyping, setIsTyping}), [isTyping, setIsTyping])

  return (
      <div>
      <UserTyping.Provider value={value}>
        <Grid container  className={classes.chatSection}>
          <Grid item xs={12}>
            <MessageContainer messages = {messages} user={user} />
            <SendMessageForm user={user}/>
          </Grid>
        </Grid>
      </UserTyping.Provider>
    </div>
  )
}

export default Chat;