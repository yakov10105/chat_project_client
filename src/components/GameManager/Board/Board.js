import React,{useEffect, useState,useContext} from 'react'
import {Grid , Divider , TextField , List,ListItem,ListItemIcon , ListItemText,Avatar,Button, Alert } from '@mui/material'
import Data from './Fields.json'
import Checker from '../Checker/Checker'
import Triangle from './Triangle/Triangle'
import getCheckers from '../getCheckers/getCheckers'
import DiceArea from '../DiceArea/DiceArea'
import { BoardContext } from "../../../Context/BoardContext";
import { IsMyTurnContext } from "../../../Context/IsMyTurnContext";
import './Board.css'
import axios from 'axios'

const Board = ({GetBoardForUser, RollDices, GetDicesValue, GetPossibleMoves, UpdatePossibleMoves, Move, GetIsMovesLeft, ChangeTurn}) => {
    //const [serverGameBoard,setServerGameBoard] = useState({})
    //const [ board,setBoard] = useState({});
    const [rightUpList,setRightUpList]= useState([])
    const [leftUpList,setLeftUpList]= useState([])
    const [leftDownList,setLeftDownList]= useState([])
    const [rightDownList,setRightDownList]= useState([])
    const [currentTriangleIdx,setCurrentTriangleIdx]= useState()
    const [possibleMoves,setPossibleMoves]= useState([])
    const [diceValues,setDiceValues]= useState();
    const [isWhiteCheckers, setIsWhiteCheckers] = useState(false);
    const {board,setBoard} = useContext(BoardContext);
    const {isMyTurn,setIsMyTurn} = useContext(IsMyTurnContext);
    const [jsonBoard,setJsonBoard]= useState({});
    

    
    useEffect(()=>{
        setIsWhiteCheckers(isMyTurn)
    },[])

    useEffect(()=>{
            //setBoard(res)
            //console.log("renderBoard");
            const JsonBoard = JSON.parse(board);
            setJsonBoard(JsonBoard);
            setLeftDownList(JsonBoard.BoardFields.filter((f)=>f.position<=5))
            setRightDownList(JsonBoard.BoardFields.filter((f)=>f.position>5 && f.position<=11))
            setRightUpList(JsonBoard.BoardFields.filter((f)=>f.position>11 && f.position<=17))
            setLeftUpList(JsonBoard.BoardFields.filter((f)=>f.position >17))



    },[board])

    useEffect(()=>{
        

        renderTriangleCanRecive(possibleMoves);

    },[possibleMoves])

    const handleRollDices= (e)=>{
        RollDices();
        const res = GetDicesValue();
        res.then((r) => {
            //console.log("DiceValues");
            setDiceValues(r);
         })
    }

    const handleTriangleClick= (index)=>{
        if(isMyTurn){
            setCurrentTriangleIdx(index)
            const res = GetPossibleMoves(index)
            res.then((r) => {
                console.log("setCurrentTriangleIdx " +index);
                console.log("handleTriangleClick " +index);
                setPossibleMoves(r);
            })
        }
    }

    const handleMove= (to)=>{
        if(currentTriangleIdx){
            Move(currentTriangleIdx, to)
            UpdatePossibleMoves();
            const val = GetDicesValue();
            val.then((v) => {
            setDiceValues(v);
            })
            const res = GetPossibleMoves(to)
            res.then((r) => {
                console.log("setCurrentTriangleIdx " +to);
                console.log("handleTriangleClick " +to);
                setPossibleMoves(r);
                const turn = GetIsMovesLeft()
                turn.then((t) => {
                    if(!t){
                        ChangeTurn();
                    }
                })
            })
            console.log("To " + to)
            console.log("From " + currentTriangleIdx)
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
                                                                                                    ()=>handleTriangleClick(index+idx)
                                                                                                : {}}  >
                    <Triangle id={index+idx} color={color} canReceive={f._canReceive}  position={position}>
                        {getCheckers(player,number)}
                    </Triangle>
                </div>
            )
        })
    }

    const renderDiceArea = () => {
        if(isMyTurn){
            return(
            <DiceArea diceValues={diceValues} clicked={handleRollDices}/>
            )
        }
    }



    const renderTriangleCanRecive = (arrayOfIndex) => {
        GetBoardForUser();
        return arrayOfIndex.map((f)=> {
            //console.log(f);
        })
    }

    return (
        <div id="game_board" className="container-fluid">

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
                    {renderDiceArea()}
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

export default Board