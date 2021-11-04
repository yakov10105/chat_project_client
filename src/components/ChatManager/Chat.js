import  MessageContainer  from "./MessageContainer";
import  SendMessageForm  from "./SendMessageForm";
import  ConnectedUsers  from "./ConnectedUsers";
import Paper from '@material-ui/core/Paper';
import useStyles from "./hooks/useStyles";
import {Button} from '@mui/material';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'

const Chat = ({messages, sendMessage, roomName,  closeConnection,user}) =>{
  const classes = useStyles();
  return (
    <div>
      <div className="leave-room">
            <Button variant="contained" onClick={() => closeConnection()}>
            Leave Room</Button>
      </div>
      <Grid container>
            <Grid item xs={12} >
                <Typography variant="h5" className="header-message">Chat</Typography>
            </Grid>
      </Grid>
      {/* <ConnectedUsers users={users}/>
      <div className="chat">
        <h1>{roomName}</h1>
          <MessageContainer messages = {messages} />
          <SendMessageForm sendMessage={sendMessage} />
      </div> */}
      <Grid container component={Paper} className={classes.chatSection}>
          <ConnectedUsers user={user}/>
          <Grid item xs={9}>
            <MessageContainer messages = {messages} />
            <SendMessageForm sendMessage={sendMessage} />
          </Grid>
      </Grid>
  </div>
  )
}

export default Chat;