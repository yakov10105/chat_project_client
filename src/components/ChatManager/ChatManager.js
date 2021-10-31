import './ChatManager.css'
import React, { useEffect, useState } from 'react'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import Chat from './Chat';


const ChatManager = (props) => {

    const [connection, setConnection] = useState(); 
    const [messages, setMessages] = useState([]); 
    const [room, setRoom] = useState('Main Room'); 
    const [users, setUsers] = useState([]); 

    useEffect(() => {
      joinRoom("idan", room)
  }, []);
  
    const joinRoom = async (user, room) => {
      try{
        const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:8082/chat")
        .configureLogging(LogLevel.Information)
        .build();
  
  
        connection.on("ReceiveMessage", (user, message) => {
          setMessages(messages => [...messages, {user , message}]);
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
        await connection.invoke("JoinRoomAsync", {user, room});
        // await connection.invoke("JoinRoom", {user, room});
  
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


    return (
        <div className="chatManager">
          <h1> {room} </h1>
          <Chat sendMessage={sendMessage} messages={messages}
        users={users} closeConnection={closeConnection} />
        </div>
    )
}

export default ChatManager
