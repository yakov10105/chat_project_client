import './ChatManager.css'
import React, { useEffect, useState } from 'react'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import Chat from './Chat';
import Lobby from './Lobby';


const ChatManager = (props) => {

  const [connection, setConnection] = useState(); 
  const [messages, setMessages] = useState([]); 
  const [users, setUsers] = useState([]); 
  const [roomName, setroomName] = useState(''); 

  const joinRoom = async (userName, room) => {
    try{
      const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:8082/chat")
      .configureLogging(LogLevel.Information)
      .build();

      setroomName(room);

      connection.on("ReceiveMessage", (userName, message) => {
        setMessages(messages => [...messages, {userName , message}]);
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
      await connection.invoke("JoinRoomAsync", {userName, room});

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

  const closeConnection = async () => {
    try{
      await connection.stop();
    } catch(e){
      console.log(e);
    }

  }

  return <div className='app'>
    {!connection
    ?<Lobby joinRoom={joinRoom} user={props.user}/>
    : <Chat sendMessage={sendMessage} messages={messages}
        users={users} roomName={roomName} closeConnection={closeConnection} />}
  </div>
}

export default ChatManager
