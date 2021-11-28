import React,{useEffect,useState, useContext, useMemo} from 'react'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import { RoomContext } from "../../Context/RoomContext";
import { BoardContext } from "../../Context/BoardContext";
import { IsMyTurnContext } from "../../Context/IsMyTurnContext";
import Board from './Board/Board'
import Grid from '@material-ui/core/Grid';
import { WinnerContext } from '../../Context/WinnerContext';
import { GameOnContext } from '../../Context/GameOnContext';

const GameManager = ({user}) => {

  const [connection, setConnection] = useState(); 
  const [board,setBoard] = useState()
  const {roomName, setRoomName} = useContext(RoomContext);
  const {isMyTurn, setIsMyTurn} = useContext(IsMyTurnContext);
  const {isGameOn, setIsGameOn} = useContext(GameOnContext);

  const [isWinner,setIsWinner] = useState(null)
  const winnerValue = useMemo(()=>({isWinner,setIsWinner}),[isWinner,setIsWinner])

    
  const value = useMemo(() => ({board,setBoard}), [board,setBoard])
      
  useEffect(()=>{
    console.log("RenderGameRoomName")
    joinGame(user.userName);
  },[roomName])

    const joinGame = async (userName) => {
        //closeConnection(senderUserName);
        try{
          const connection = new HubConnectionBuilder()
          .withUrl(`http://localhost:8082/game`,{accessTokenFactory: ()=> localStorage.getItem('key')})
          .configureLogging(LogLevel.Information)
          .build();

          connection.on("GetRoomBoard", async () => {
            try{
                await connection.invoke("GetBoard").then((res)=>{
                  setBoard(res)
                });
            } catch(e){
              console.log(e);
            }
          });

          connection.on("AnyWinner",async (winnerName)=>{
              if(user.userName===winnerName){
                 setIsWinner(true)
              }
              else{
                setIsWinner(false)
              }
          })

          connection.on("ChangeTurn", async () => {
              setIsMyTurn(current => !current, async () => {
                await connection.invoke("GetBoard").then((res)=>{
                  setBoard(res)
                });
              });
          })

          connection.onclose(e => {
            setConnection();
            setIsGameOn(false);
          })
    
          await connection.start();
          await connection.invoke("JoinGameAsync",{UserName:userName,RoomName:roomName,IsMyTurn:isMyTurn});
          setConnection(connection);
          await connection.invoke("GetBoard").then((res)=>{
            setBoard(res)
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

      const CheckForWinner=async()=>{
        try{
          await connection.invoke("CheckForWinner")
        }catch(err){
          console.log(err)
        }
      }

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

      const UpdatePossibleMoves = async () => {
        try{
            await connection.invoke("UpdatePossibleMoves");
        } catch(e){
          console.log(e);
        }
      }

      const Move = async (from, to) => {
        try{
            await connection.invoke("Move", {from, to});
        } catch(e){
          console.log(e);
        }
      }

      const GetIsMovesLeft = async () => {
        try{
            return(await connection.invoke("CheckIfMovesLeft"));
        } catch(e){
          console.log(e);
        }
      }

      const ChangeTurn = async () => {
        try{
            await connection.invoke("ChangePlayerTurn");
        } catch(e){
          console.log(e);
        }
      }

      const GetEliminatedCheckers = async (isWhite) => {
        try{
          return(await connection.invoke("GetNumberOfEliminatedCheckers", isWhite));
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

      <WinnerContext.Provider value={winnerValue}>
        <BoardContext.Provider value={value}>
          <div className='game_manager' 
              style={{
                  'height': '70vh',
                  'width': '70vw'
              }}>
              {board && <Board
                user = {user}
                board={board}
                GetBoardForUser={GetBoardForUser}
                RollDices={RollDices}
                GetDicesValue={GetDicesValue}
                GetPossibleMoves={GetPossibleMoves}
                UpdatePossibleMoves={UpdatePossibleMoves}
                Move={Move}
                CheckForWinner={CheckForWinner}
                GetIsMovesLeft={GetIsMovesLeft}
                ChangeTurn={ChangeTurn}
                GetEliminatedCheckers={GetEliminatedCheckers}
                closeConnection={closeConnection}/>}
          </div>
        </BoardContext.Provider>
      </WinnerContext.Provider>
    )
}

export default GameManager