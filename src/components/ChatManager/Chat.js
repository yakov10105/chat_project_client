import  MessageContainer  from "./MessageContainer";
import  SendMessageForm  from "./SendMessageForm";
import  ConnectedUsers  from "./ConnectedUsers";
import {Button} from '@mui/material';


const Chat = ({messages, sendMessage, roomName,  closeConnection, users}) =>{
    
  return <div>
      <div className="leave-room">
            <Button variant="contained" onClick={() => closeConnection()}>
            Leave Room</Button>

      </div>
      <ConnectedUsers users={users}/>
    <div className="chat">
      <h1>{roomName}</h1>
        <MessageContainer messages = {messages} />
        <SendMessageForm sendMessage={sendMessage} />
    </div>
</div>
}

export default Chat;