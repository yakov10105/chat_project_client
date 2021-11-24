import {ChatConnection} from '../../ConnectionContext/ChatConnection';
import React,{useState,useEffect,useContext} from "react";

const JoinChatRoom = (props) => {

    const {chatConnection, setChatConnection} = useContext(ChatConnection);

    const senderUserName = props.user;
    const recieverUserName = props.userName;
    
    const joinRoom = async () => {
      if(chatConnection){
        closeConnection(senderUserName);
      }
      try{
        const connection = new HubConnectionBuilder()
        .withUrl(`http://localhost:8082/chat`,{accessTokenFactory: ()=> localStorage.getItem('key')})
        .configureLogging(LogLevel.Information)
        .build();
  
  
        // connection.on("ReceiveMessage", (userName, message) => {
        //   let date = new Date()
        //   let dateString = `${date.getHours()}:${date.getMinutes()} (${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()})`
        //   setMessages(messages => [...messages, {user:userName ,message: message, date:dateString }]);
        //   //play();
        // });
  
        connection.onclose(e => {
          setChatConnection();
          setMessages([]);
          setUsers([]);
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
      //getMessagesHistory(props.senderUserName,props.recieverUserName)
    }
    
  }
  
  export default JoinChatRoom