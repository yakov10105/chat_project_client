import React,{useEffect, useContext} from 'react'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import { RoomContext } from "../../Context/RoomContext";
import Board from './Board/Board'
import Checker from './Checker/Checker'

const GameManager = ({user}) => {

    const {roomName, setRoomName} = useContext(RoomContext);

    const joinGame = async (userName) => {
        //closeConnection(senderUserName);
        try{
          const connection = new HubConnectionBuilder()
          .withUrl(`http://localhost:8082/game`,{accessTokenFactory: ()=> localStorage.getItem('key')})
          .configureLogging(LogLevel.Information)
          .build();
    
          connection.onclose(e => {
            //setConnection();
            //setMessages([]);
            //setUsers([]);
            //setIsOpenChat(false);
          })
    
          await connection.start();
          debugger;
          await connection.invoke("JoinGameAsync",  userName);
          
        } catch(e){
          console.log(e);
        }
      }

      
  useEffect(()=>{
    joinGame(user.userName);
  },[])

    return (
        <div className='game_manager' 
            style={{
                'height': '80vh',
                'width': '80vw',
                'background-color': 'aliceblue',
            }}>
            <Board/>
        </div>
    )
}

export default GameManager