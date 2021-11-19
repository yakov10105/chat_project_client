import React,{useEffect,useState, useContext, useMemo} from 'react'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import { RoomContext } from "../../Context/RoomContext";
import { BoardContext } from "../../Context/BoardContext";
import Board from './Board/Board'

const GameManager = ({user}) => {

  const [connection, setConnection] = useState(); 
  const [board,setBoard] = useState()
  const [isMyTurn,setIsMyTurn] = useState(false);
  const {roomName, setRoomName} = useContext(RoomContext);

    
  const value = useMemo(() => ({board,setBoard}), [board,setBoard])
      
  useEffect(()=>{
    console.log("RenderGameRoomName")
    joinGame(user.userName);
  },[roomName])

    const joinGame = async (userName) => {
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
          setConnection(connection);
          await connection.invoke("GetBoard").then((res)=>{
            setBoard(res)
          })
          
          await connection.invoke("GetCurrentPlayerName")
          .then((res)=>{
              if(user.userName===res){
                setIsMyTurn(true)
              }else{
                setIsMyTurn(false)
              }
            })
          
        } catch(e){
          console.log(e);
        }
      }

      const GetBoardForUser = async () => {
        try{
            await connection.invoke("GetBoard").then((res)=>{
              setBoard(res)
            });
        } catch(e){
          console.log(e);
        }
      }

      // const isActivePlayer = async()=>{
      //   try{
      //     await connection.invoke("GetCurrentPlayerName")
      //       .then((res)=>{
      //           if(user.userName===res){
      //             setIsMyTurn(true)
      //           }else{
      //             setIsMyTurn(false)
      //           }
      //         })
      //        } catch(e){
      //       console.log(e);
      //       }
      //     }

      const RollDices = async () => {
        try{
            await connection.invoke("RollDices");
        } catch(e){
          console.log(e);
        }
      }

      const GetDicesValue = async () => {
        try{
            return(await connection.invoke("GetDicesValue"));
        } catch(e){
          console.log(e);
        }
      }

      const GetPossibleMoves = async (pos) => {
        try{
            return(await connection.invoke("GetPossibleMoves", pos));
        } catch(e){
          console.log(e);
        }
      }

    return (
        <div className='game_manager' 
            style={{
                'height': '80vh',
                'width': '80vw',
                'background-color': 'aliceblue',
            }}>
              <BoardContext.Provider value={value}>
            {board && <Board
              //getBoard={getBoard}
              board={board}
              GetBoardForUser={GetBoardForUser}
              RollDices={RollDices}
              GetDicesValue={GetDicesValue}
              GetPossibleMoves={GetPossibleMoves}
              isActivePlayer={isMyTurn}/>}
              </BoardContext.Provider>
        </div>
    )
}

export default GameManager