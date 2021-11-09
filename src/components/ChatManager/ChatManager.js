import './ChatManager.css'
import React, { useEffect, useState } from 'react'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import Chat from './Chat';
import axios from 'axios';
import useSound from 'use-sound';
import notificationSound from '../../sounds/Notification.mp3'


const ChatManager = (props) => {

  const [play] = useSound(notificationSound)

  const [connection, setConnection] = useState(); 
  const [messages, setMessages] = useState([]); 
  const [users, setUsers] = useState([]); 
  const [roomName, setroomName] = useState('room');
  const [isOpenChat , setIsOpenChat] = useState(false) 
  const user = props.location.state.user;

  useEffect(()=>{

  },[isOpenChat])

  useEffect(()=>{

  },[roomName])

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
            list.push({user:res.data[i].senderUserName, message:res.data[i].text})
          }
          setMessages(list)
        }
    }).catch(err=>{
      console.log(err)
    })
  }

  const joinRoom = async (senderUserName,recieverUserName) => {
    closeConnection(senderUserName);
    try{
      const connection = new HubConnectionBuilder()
      .withUrl(`http://localhost:8082/chat`,{accessTokenFactory: ()=> localStorage.getItem('key')})
      .configureLogging(LogLevel.Information)
      .build();



      connection.on("ReceiveMessage", (userName, message) => {
        setMessages(messages => [...messages, {user:userName ,message: message}]);
        //play();
      });

      
      connection.on("UsersInRoom", (users) => {
        setUsers(users);
      });

      connection.onclose(e => {
        setConnection();
        setMessages([]);
        setUsers([]);
      })

      await connection.start();
      await connection.invoke("JoinRoomAsync", { SenderUserName:senderUserName,ReciverUserName:recieverUserName});

      setConnection(connection);
      setroomName(connection.invoke('GetRoomId',{SenderUserName:senderUserName,ReciverUserName:recieverUserName}))
      setIsOpenChat(true)

    } catch(e){
      console.log(e);
    }
    getMessagesHistory(senderUserName,recieverUserName)
  }

  const sendMessage = async (message) => {
    try{
        await connection.invoke("SendMessageAsync", message);
    } catch(e){
      console.log(e);
    }
  }

  const closeConnection = async (userName) => {
    //need to set the user offline - need to figure out how to do that
    try{
      await connection.stop();
    } catch(e){
      console.log(e);
    }
  }

  return (
    <div className='app'>
      <Chat sendMessage={sendMessage} 
                messages={messages}
                users={users} 
                roomName={roomName} 
                closeConnection={closeConnection} 
                user={user.userName}
                joinRoom={joinRoom} 
                chatFlag={isOpenChat}/>
    </div>
  )
}

export default ChatManager
