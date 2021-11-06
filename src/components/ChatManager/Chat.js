import  MessageContainer  from "./MessageContainer";
import  SendMessageForm  from "./SendMessageForm";
import  ConnectedUsers  from "./ConnectedUsers";
import Paper from '@material-ui/core/Paper';
import {Button} from '@mui/material';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme =>({
  chatSection: {
    width: '100%',
    height:'100%'
  }
}));

const Chat = (props) =>{
  const classes = useStyles();
  return (
    <div>
      <div className="leave-room">
            <Button variant="contained" onClick={() => props.closeConnection(props.user)}>Leave Room</Button>
      </div>
      <Grid container>
            <Grid item xs={12} >
                <Typography variant="h5" className="header-message">Chat</Typography>
            </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
          <ConnectedUsers user={props.user} openUserChat={props.openUserChat}/>
          <Grid item xs={9}>
            <MessageContainer messages = {props.messages}  user={props.user}/>
            <SendMessageForm sendMessage={props.sendMessage} />
          </Grid>
      </Grid>
  </div>
  )
}

export default Chat;