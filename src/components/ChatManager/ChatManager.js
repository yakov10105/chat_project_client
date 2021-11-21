import './ChatManager.css'
import React, {useContext, useEffect, useState } from 'react'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import Chat from './Chat';
import LogoutButton from '../Logout/LogoutButton';
import GameManager from '../GameManager/GameManager';
import axios from 'axios';
import useSound from 'use-sound';
import notificationSound from '../../sounds/Notification.mp3'
import {GameOnContext} from '../../Context/GameOnContext';
import {RoomContext} from '../../Context/RoomContext';


const ChatManager = (props) => {

  const [play] = useSound(notificationSound)

  const [connection, setConnection] = useState(); 
  const [messages, setMessages] = useState([]); 
  const [users, setUsers] = useState([]); 
  const [isOpenChat , setIsOpenChat] = useState(false) 
  const {roomName, setRoomName} = useContext(RoomContext);
  const {isGameOn, setIsGameOn} = useContext(GameOnContext);
  const user = props.user;

  useEffect(()=>{

  },[isOpenChat])

  useEffect(()=>{

  },[roomName])


  const getMessagesHistory = (senderUserName,recieverUserName, setRoom)=>{
    axios.get(`http://localhost:8082/api/messages/get-messages?senderUserName=${senderUserName}&recieverUserName=${recieverUserName}`,{
      headers:{
        "Authorization":localStorage.getItem('key')
      }
    })
    .then(res=>{
        if(res.data){
          const list = [];
          for(let i=0;i<res.data.length;i++){
            list.push({user:res.data[i].senderUserName, message:res.data[i].text , date:res.data[i].date})
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
        let date = new Date()
        let dateString = `${date.getHours()}:${date.getMinutes()} (${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()})`
        setMessages(messages => [...messages, {user:userName ,message: message, date:dateString }]);
        //play();
      });

      connection.onclose(e => {
        setConnection();
        setMessages([]);
        setUsers([]);
        //setIsOpenChat(false);
      })

      await connection.start();
      await connection.invoke("JoinRoomAsync", { SenderUserName:senderUserName,ReciverUserName:recieverUserName});
      setConnection(connection);
      setIsOpenChat(true)
      connection.invoke('GetRoomId',{SenderUserName:senderUserName,ReciverUserName:recieverUserName})
        .then((res)=>{
          setRoomName(res)
        })
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
    try{
      await connection.stop();
    } catch(e){
      console.log(e);
    }
  }
  

  return (
    <div className='chat_manager' className={isGameOn ? ' no_messages': null} >
      <LogoutButton/>
      <Chat sendMessage={sendMessage} 
                messages={messages}
                //users={users}
                // roomName={roomName} 
                closeConnection={closeConnection} 
                user={user.userName}
                joinRoom={joinRoom} 
                chatFlag={isOpenChat}/>
    </div>
  )
}

export default ChatManager