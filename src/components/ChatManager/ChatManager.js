import './ChatManager.css'
import React, { useEffect, useState } from 'react'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import Chat from './Chat';
import Lobby from './Lobby';
import axios from 'axios';


const ChatManager = (props) => {

  const [connection, setConnection] = useState(); 
  const [messages, setMessages] = useState([]); 
  const [users, setUsers] = useState([]); 
  const [roomName, setroomName] = useState(''); 

  const joinRoom = async (userName, room) => {
    try{
      const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:8082/chat",{accessTokenFactory: ()=> localStorage.getItem('key')})
      .configureLogging(LogLevel.Information)
      .build();

      setroomName(room);

      connection.on("ReceiveMessage", (userName, message) => {
        setMessages(messages => [...messages, {user:userName ,message: message}]);
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
      await connection.invoke("JoinRoomAsync", { user:userName,room:room});

      setConnection(connection);

    } catch(e){
      console.log(e);
    }
  }

  const sendMessage = async (message) => {
    try{
        await connection.invoke("SendMessageAsync", message);
    } catch(e){
      console.log(e);
    }
  }

  const closeConnection = async (userName) => {
    try{
      await connection.stop();
      axios
        .get(`http://localhost:8082/api/users/offline?userName=${userName}`)
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
    } catch(e){
      console.log(e);
    }

  }
  const openUserChat =(userName,user)=>{

  }

  return <div className='app'>
    {!connection
    ?<Lobby joinRoom={joinRoom} user={props.location.state.user.userName}/>
    : <Chat sendMessage={sendMessage} 
            messages={messages}
            users={users} 
            roomName={roomName} 
            closeConnection={closeConnection} 
            user={props.location.state.user.userName}
            openUserChat={openUserChat} />}
  </div>
}

export default ChatManager
