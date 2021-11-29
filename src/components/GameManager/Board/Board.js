import React,{useEffect, useState,useContext} from 'react'
import {Grid , Divider , TextField , List,ListItem,ListItemIcon , ListItemText,Avatar,Button, Alert } from '@mui/material'
import Checker from '../Checker/Checker'
import Triangle from './Triangle/Triangle'
import getCheckers from '../getCheckers/getCheckers'
import DiceArea from '../DiceArea/DiceArea'
import { BoardContext } from "../../../Context/BoardContext";
import { IsMyTurnContext } from "../../../Context/IsMyTurnContext";
import { WinnerContext } from '../../../Context/WinnerContext'
import  EndGamePage  from '../EndGamePage/EndGamePage'
import './Board.css'
import axios from 'axios'
import useEnhancedEffect from '@mui/utils/useEnhancedEffect'

const Board = ({user, GetBoardForUser,CheckForWinner, RollDices, GetDicesValue, GetPossibleMoves, UpdatePossibleMoves, Move, GetIsMovesLeft, ChangeTurn, GetEliminatedCheckers, closeConnection}) => {
    const [rightUpList,setRightUpList]= useState([])
    const [leftUpList,setLeftUpList]= useState([])
    const [leftDownList,setLeftDownList]= useState([])
    const [rightDownList,setRightDownList]= useState([])
    const [currentTriangleIdx,setCurrentTriangleIdx]= useState()
    const [possibleMoves,setPossibleMoves]= useState([])
    const [diceValues,setDiceValues]= useState();
    const [isWhiteCheckers, setIsWhiteCheckers] = useState(false);
    const [canDragToGoalField,setCanDragToGoalField]=useState(false)
    const [blackEliminated,setBlackEliminated]=useState(0)
    const [whiteEliminated,setWhiteEliminated]=useState(0)
    const [blackOutOffBoard,SetBlackOutOffBoard]=useState([])
    const [whiteOutOffBoard,SetWhiteOutOffBoard]=useState([])
    const {board,setBoard} = useContext(BoardContext);
    const {isMyTurn,setIsMyTurn} = useContext(IsMyTurnContext);
    const {isWinner,setIsWinner} = useContext(WinnerContext);
    const [jsonBoard,setJsonBoard]= useState({});

    
    
    useEffect(()=>{
        setIsWhiteCheckers(isMyTurn)
    },[])

    useEffect(()=>{

    },[isWinner])

    useEffect(()=>{
        const JsonBoard = JSON.parse(board);
        console.log(JsonBoard);
        setJsonBoard(JsonBoard);
        setLeftDownList(JsonBoard.BoardFields.filter((f)=>f.position<=5))
        setRightDownList(JsonBoard.BoardFields.filter((f)=>f.position>5 && f.position<=11))
        setRightUpList(JsonBoard.BoardFields.filter((f)=>f.position>11 && f.position<=17))
        setLeftUpList(JsonBoard.BoardFields.filter((f)=>f.position >17))
        SetBlackOutOffBoard(JsonBoard.GoalFieldPlayer2.checkers.length)
        SetWhiteOutOffBoard(JsonBoard.GoalFieldPlayer1.checkers.length)
        updateEliminated();


},[board])

    const updateEliminated= async () => {
        console.log("updateEliminated");
            const WhiteEleminated = GetEliminatedCheckers(true);
            await WhiteEleminated.then((number) =>{
                    setWhiteEliminated(number);
                    console.log("setWhiteEliminated" + number);
            });

            const BlackEleminated = GetEliminatedCheckers(false);
            await BlackEleminated.then((number) =>{
                    setBlackEliminated(number);
                    console.log("setWhiteEliminated" + number);
            });
    }

    useEffect(()=>{
        

        renderTriangleCanRecive();

    },[possibleMoves])

    const handleRollDices= (e)=>{
        RollDices();
        const res = GetDicesValue();
        res.then((r) => {
            setDiceValues(r);
         })
    }

    const handleTriangleClick= async (index)=>{
        if(isMyTurn){
            console.log(canDragToGoalField)
            console.log(isWhiteCheckers)
            setCurrentTriangleIdx(index)
            const res = GetPossibleMoves(index)
            setPossibleMoves([]);
            await res.then((r) => {
                console.log(r)
                    setPossibleMoves(r);
                    const turn = GetIsMovesLeft()
                    turn.then((t) => {
                        if(!t){
                            CheckForWinner();
                            resetBoardState();
                            ChangeTurn();
                        }
                    })
                    console.log(possibleMoves)
                    for(let i =0; i<possibleMoves.length;i++){
                        if(possibleMoves[i]===27 || possibleMoves[i]===26){
                            setCanDragToGoalField(true)
                        }
                    }
            })
        }
    }

    const handleMove= (to)=>{
        console.log("handleMove " +currentTriangleIdx + to)
        if(currentTriangleIdx !== undefined){
            console.log("handleMove " +currentTriangleIdx + to)
            Move(currentTriangleIdx, to)
            UpdatePossibleMoves();
            const val = GetDicesValue();
            val.then((v) => {
            setDiceValues(v);
            })
            if(to !== 25){
                const res = GetPossibleMoves(to)
                res.then((r) => {
                    setPossibleMoves(r);
                    setCurrentTriangleIdx(to)
                    const turn = GetIsMovesLeft()
                    turn.then((t) => {
                        if(!t){
                            CheckForWinner();
                            resetBoardState();
                            ChangeTurn();
                        }
                    })
                })
            }
            else{
                const res = GetPossibleMoves(to)
                res.then((r) => {
                    setPossibleMoves(r);
                    setCurrentTriangleIdx(25)
                    const turn = GetIsMovesLeft()
                    turn.then((t) => {
                        if(!t){
                            CheckForWinner();
                            resetBoardState();
                            ChangeTurn();
                        }
                    })
                })
            }
        }
    }
    
    const renderTriangle = (array,index) => {
        return array.map((f,idx)=> {
            let position,color,number,player;
            if(isWhiteCheckers){
                if(f.position>=0 && f.position<=11) 
                    position="bottom"
                else 
                    position="top"
                
                if(f.position%2 === 0)
                    color= "1"
                else
                    color= "2"
                    if(f.checkers.length>0){
                        if(f.checkers[0].player.id=== jsonBoard.Player1.id){
                            player=1
                        }
                        else
                            player=2
                    }  
            }
            else{
                
            if(f.position>=0 && f.position<=11) 
            position="top"
        else 
            position="bottom"
        
        if(f.position%2 === 0)
            color= "1"
        else
            color= "2"
            if(f.checkers.length>0){
                if(f.checkers[0].player.id=== jsonBoard.Player1.id){
                    player=1
                }
                else
                    player=2
            }  
            }
            number = f.checkers.length
            
          return (
                <div className={"tria_container " + position} id={index+idx} onClick={isMyTurn && diceValues ?
                                                                                                f._canReceive ?
                                                                                                    () => (handleMove(index+idx)):

                                                                                                    ()=>( (isWhiteCheckers&& whiteEliminated > 0 ? handleTriangleClick(25) :
                                                                                                          (!isWhiteCheckers && blackEliminated > 0) ? handleTriangleClick(25) :
                                                                                                           handleTriangleClick(index+idx)))
                                                                                                : {}}  >
                    <Triangle id={index+idx} color={color} canReceive={(f._canReceive && isMyTurn)}  position={position}>
                        {getCheckers(player,number)}
                    </Triangle>
                </div>
            )
        })
    }

    const renderDiceArea = (turn) => {
        if(turn){
            return(
            <DiceArea diceValues={diceValues} clicked={handleRollDices}/>
            )
        }
        else{
            return(
                <div className="oponent-turn">
                    Oponent Turn
                </div>
                )
        }
    }

    const renderWhiteEaten = () => {
        return(
            <div className="Container-elimenited" id="white-elimenited">
                <Checker player={1}/>
                <div>Eaten white: {whiteEliminated}</div>
                <div>Out Of Board: {whiteOutOffBoard}</div>
        </div>
        )
    }

    const renderBlackEaten = () => {
        return(
        <div className="Container-elimenited" id="black-elimenited">
            <Checker/>
            <div>Eaten black: {blackEliminated}</div>
            <div>Out Of Board: {blackOutOffBoard}</div>
        </div>
        )
    }

    const resetBoardState = () => {
        setDiceValues();
        setCurrentTriangleIdx()
        setPossibleMoves([]);
    }


    const renderTriangleCanRecive = () => {
        GetBoardForUser();
    }

    if(isWinner===null){
        return (
            <div id="game_board" className="container-fluid">
                    {renderBlackEaten()}
                    {renderWhiteEaten()}
                <div className="container-out">
                    <button style={{width:"100%" ,
                                    height:"100%",
                                    marginTop:"100px",
                                    background:canDragToGoalField? "green" : "red",
                                    cursor:canDragToGoalField? "pointer" : ""}}
                                    onClick={canDragToGoalField? 
                                                                isWhiteCheckers?
                                                                    ()=>handleMove(27):
                                                                    ()=>handleMove(26)
                                                            :{}}>
                    </button>
                </div>
                <div id="leftSide" className="row">
                    <div className={isWhiteCheckers ? "blocksUpWhite" : "blocksDownBlack"}>
                        {renderTriangle(leftUpList,18)}
                    </div>
                    <div className={isWhiteCheckers ? "blocksDownWhite" : "blocksUpBlack"}>
                        {renderTriangle(leftDownList,0)}
                    </div>
                </div>
                <div id="center">
                    <div className="centerDashBoard">
                        {renderDiceArea(isMyTurn)}
                    </div>
                </div>
    
                <div id="rightSide" className="row">
                    <div className={isWhiteCheckers ? "blocksUpWhite" : "blocksDownBlack"}>
                        {renderTriangle(rightUpList,12)}
                    </div>
                    <div className={isWhiteCheckers ? "blocksDownWhite" : "blocksUpBlack"}>
                        {renderTriangle(rightDownList,6)}
                    </div>
                </div>
            </div>
        )
    }
    else {
        return <EndGamePage isWinner={isWinner} closeConnection={closeConnection}/>
    }
}

export default Board