import './ChatManager.css'
import React, {useContext, useEffect, useState } from 'react'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import Chat from './Chat/Chat';
import axios from 'axios';
import useSound from 'use-sound';
import notificationSound from '../../sounds/Notification.mp3'
import  ConnectedUsers  from "./ConnectedUsers/ConnectedUsers";
import {GameOnContext} from '../../Context/GameOnContext';
import {RoomContext} from '../../Context/RoomContext';
import {ChatConnection} from '../../ConnectionContext/ChatConnection';
import {AccountConnection} from '../../ConnectionContext/AccountConnection';


const ChatManager = (props) => {

  const [play] = useSound(notificationSound)

  const [messages, setMessages] = useState([]); 
  const {roomName, setRoomName} = useContext(RoomContext);
  const {isGameOn, setIsGameOn} = useContext(GameOnContext);
  const {chatConnection, setChatConnection} = useContext(ChatConnection);
  const {accountConnection, setAccountConnection} = useContext(AccountConnection);
  const user = props.user;

  const getMessagesHistory = (senderUserName,recieverUserName)=>{
    axios.get(`http://localhost:8082/api/messages/get-messages?senderUserName=${senderUserName}&recieverUserName=${recieverUserName}`,{
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
          // console.log(list)
        }
    }).catch(err=>{
      console.log(err)
    })
  }

  const joinRoom = async (senderUserName,recieverUserName) => {
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
        setMessages(messages => [...messages, {user:userName ,message: message, date:dateString, recieverHasRead: false }]);//, recieverHasRead: false
        // if(user.userName != userName){
        //   play();
        // }
      });

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
    <div className='chat_manager' className={isGameOn ? ' no_messages': null} >
      <ConnectedUsers closeConnection={closeConnection} user={user.userName} joinRoom={joinRoom} messages={messages}/>
      {!isGameOn && chatConnection && 
      <Chat 
       messages={messages}
       closeConnection={closeConnection} 
       user={user.userName}
       joinRoom={joinRoom} />}
      
    </div>
  )
}

export default ChatManager