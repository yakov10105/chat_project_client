import React,{useEffect,useState, useContext} from 'react'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import { RoomContext } from "../../Context/RoomContext";
import Board from './Board/Board'
import Checker from './Checker/Checker'

const GameManager = ({user}) => {

  const [connection, setConnection] = useState({}); 
  const [board,setBoard] = useState()
  const {roomName, setRoomName} = useContext(RoomContext);

    const joinGame = async (userName) => {
        //closeConnection(senderUserName);
        try{
          const connection = new HubConnectionBuilder()
          .withUrl(`http://localhost:8082/game`,{accessTokenFactory: ()=> localStorage.getItem('key')})
          .configureLogging(LogLevel.Information)
          .build();
    
          connection.onclose(e => {
            setConnection();
            
          })
    
          await connection.start();
          await connection.invoke("JoinGameAsync",{UserName:userName,RoomName:roomName});
          setConnection(connection)
          await connection.invoke("GetBoard").then((res)=>{
            setBoard(res)
          })
          
        } catch(e){
          console.log(e);
        }
      }

      
  useEffect(()=>{
    joinGame(user.userName);
  },[roomName])

    return (
        <div className='game_manager' 
            style={{
                'height': '80vh',
                'width': '80vw',
                'background-color': 'aliceblue',
            }}>
            {board && <Board
              //getBoard={getBoard}
              board={board}/>}
        </div>
    )
}

export default GameManager