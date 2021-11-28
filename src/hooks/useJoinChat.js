import {useState} from "react"; 
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import {ChatConnection} from '../ConnectionContext/ChatConnection';

const useJoinChat =  async (senderUserName,recieverUserName,setMessages,closeConnection) => {
        if(chatConnection){
          closeConnection(senderUserName);
        }
        try{
          const connection = new HubConnectionBuilder()
          .withUrl(`http://localhost:8082/chat`,{accessTokenFactory: ()=> localStorage.getItem('key')})
          .configureLogging(LogLevel.Information)
          .build();
    
    
          connection.on("ReceiveMessage", (userName, message) => {
            let date = new Date()
            let dateString = `${date.getHours()}:${date.getMinutes()} (${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()})`
            setMessages(messages => [...messages, {user:userName ,message: message, date:dateString, recieverHasRead: false }]);
          });
    
          connection.onclose(e => {
            setChatConnection();
            setMessages([]);
          })
    
          await connection.start();
          await connection.invoke("JoinRoomAsync", { SenderUserName:senderUserName,ReciverUserName:recieverUserName});
          setChatConnection(connection);
          connection.invoke('GetRoomId',{SenderUserName:senderUserName,ReciverUserName:recieverUserName})
            .then((res)=>{
              setRoomName(res)
            })
        } catch(e){
          console.log(e);
        }
        getMessagesHistory(senderUserName,recieverUserName)
}

export default useInput;
