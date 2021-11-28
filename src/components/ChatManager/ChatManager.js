import './ChatManager.css'
import React, {useContext, useEffect, useState } from 'react'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import Chat from './Chat/Chat';
import axios from 'axios';
import useSound from 'use-sound';
import  ConnectedUsers  from "./ConnectedUsers/ConnectedUsers";
import {GameOnContext} from '../../Context/GameOnContext';
import {RoomContext} from '../../Context/RoomContext';
import {ChatConnection} from '../../ConnectionContext/ChatConnection';
import {AccountConnection} from '../../ConnectionContext/AccountConnection';
import {ReciverContext} from '../../Context/ReciverUserContext';


const ChatManager = (props) => {

  const [messages, setMessages] = useState([]); 
  const {roomName, setRoomName} = useContext(RoomContext);
  const {isGameOn, setIsGameOn} = useContext(GameOnContext);
  const {chatConnection, setChatConnection} = useContext(ChatConnection);
  const {accountConnection, setAccountConnection} = useContext(AccountConnection);
  const {reciverUser, setReciverUser} = useContext(ReciverContext);
  const user = props.user;

  const getMessagesHistory = (senderUserName,recieverUserName)=>{
    axios.get(`https://chatappbackgammon.azurewebsites.net/api/messages/get-messages?senderUserName=${senderUserName}&recieverUserName=${recieverUserName}`,{
      headers:{
        "Authorization":localStorage.getItem('key')
      }
    })
    .then(res=>{
        if(res.data){
          const list = [];
          for(let i=0;i<res.data.length;i++){
            list.push({user:res.data[i].senderUserName, message:res.data[i].text , date:res.data[i].date, recieverHasRead:res.data[i].recieverHasRead })
          }
          setMessages(list)
        }
    }).catch(err=>{
      console.log(err)
    })
  }

  const joinRoom = async () => {
    let senderUserName = user.userName
    let recieverUserName = reciverUser.userName
    if(chatConnection){
      closeConnection(senderUserName);
    }
    try{
      const connection = new HubConnectionBuilder()
      .withUrl(`https://chatappbackgammon.azurewebsites.net/chat`,{accessTokenFactory: ()=> localStorage.getItem('key')})
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


  const closeConnection = async () => {
    try{
      await chatConnection.stop();
    } catch(e){
      console.log(e);
    }
  }
  

  return (
    <div className='chat_manager'>
      <ConnectedUsers closeConnection={closeConnection} user={user} joinRoom={joinRoom}/>
      {!isGameOn && chatConnection && reciverUser && 
      <Chat 
       messages={messages}
       closeConnection={closeConnection} 
       user={user.userName}
       joinRoom={joinRoom} />}
      
    </div>
  )
}

export default ChatManager