import React,{useEffect, useState,useContext} from 'react'
import {Grid , Divider , TextField , List,ListItem,ListItemIcon , ListItemText,Avatar,Button, Alert } from '@mui/material'
import Checker from '../Checker/Checker'
import Triangle from './Triangle/Triangle'
import getCheckers from '../getCheckers/getCheckers'
import DiceArea from '../DiceArea/DiceArea'
import { BoardContext } from "../../../Context/BoardContext";
import { IsMyTurnContext } from "../../../Context/IsMyTurnContext";
import { WinnerContext } from '../../../Context/WinnerContext'
import './Board.css'
import axios from 'axios'
import useEnhancedEffect from '@mui/utils/useEnhancedEffect'

const Board = ({user, GetBoardForUser,CheckForWinner, RollDices, GetDicesValue, GetPossibleMoves, UpdatePossibleMoves, Move, GetIsMovesLeft, ChangeTurn, GetEliminatedCheckers}) => {
    const [rightUpList,setRightUpList]= useState([])
    const [leftUpList,setLeftUpList]= useState([])
    const [leftDownList,setLeftDownList]= useState([])
    const [rightDownList,setRightDownList]= useState([])
    const [currentTriangleIdx,setCurrentTriangleIdx]= useState()
    const [possibleMoves,setPossibleMoves]= useState([])
    const [diceValues,setDiceValues]= useState();
    const [isWhiteCheckers, setIsWhiteCheckers] = useState(false);
    const [numberOfEaten, setNumberOfEaten] = useState(0);
    const [oponentEliminated,setOponentEliminated]=useState(0)
    const [canDragToGoalField,setCanDragToGoalField]=useState(false)
    const [numberOfOut, setNumberOfOut] = useState(0);
    const [blackEliminated,setBlackEliminated]=useState(0)
    const [oponentOutOffBoard,SetOponentOutOffBoard]=useState(0)
    const [blackOutOffBoard,SetBlackOutOffBoard]=useState(0)
    const [whiteOutOffBoard,SetWhiteOutOffBoard]=useState(0)
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
            //setBoard(res)
            //console.log("renderBoard");
            const JsonBoard = JSON.parse(board);
            setJsonBoard(JsonBoard);
            setLeftDownList(JsonBoard.BoardFields.filter((f)=>f.position<=5))
            setRightDownList(JsonBoard.BoardFields.filter((f)=>f.position>5 && f.position<=11))
            setRightUpList(JsonBoard.BoardFields.filter((f)=>f.position>11 && f.position<=17))
            setLeftUpList(JsonBoard.BoardFields.filter((f)=>f.position >17))
            // setBlackEliminated(JsonBoard.EliminatedField.checkers.filter(c=>c.player.id!==user.id))

            //updateEliminated();
            //setCanDragToGoalField(false)
            SetWhiteOutOffBoard(JsonBoard.GoalFieldPlayer1.checkers)
            SetBlackOutOffBoard(JsonBoard.GoalFieldPlayer2.checkers)

            setNumberOfEaten(oponentEliminated.length)
            setNumberOfOut(isWhiteCheckers ? whiteOutOffBoard.length : blackOutOffBoard.length)

            //console.log(blackEliminated,whiteEliminated,whiteOutOffBoard,blackOutOffBoard)
            // setIsMyTurn(isMyTurn);
            // console.log(isMyTurn);



    },[board])

    // const updateEliminated= () => {
    //     if(isWhiteCheckers){
    //         const eleminated = GetEliminatedCheckers(isWhiteCheckers);
    //         eleminated.then((res) =>{
    //             let num = res.length;
    //             setNumberOfBlackEliminated(num);
    //             console.log(numberOfBlackEliminated);
    //         });
    //         // setNumberOfEaten(oponentEliminated.length)
    //     }
    //     else{
    //     const eleminated = GetEliminatedCheckers(!isWhiteCheckers);
    //     eleminated.then((res) =>{
    //         let num = res.length;
    //         setNumberOfWhiteEliminated(num);
    //         console.log(numberOfWhiteEliminated);
    //     });
    //     //setNumberOfEaten(oponentEliminated.length)
    //     }
    // }

    useEffect(()=>{
        

        renderTriangleCanRecive();

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
            setPossibleMoves([]);
            res.then((r) => {
                console.log("setCurrentTriangleIdx " +index);
                setPossibleMoves(r);
                for(let i =0; i<possibleMoves.length;i++){
                    if(possibleMoves[i]===27 || possibleMoves[i]===26){
                        setCanDragToGoalField(true)
                    }
                }
            })
        }
    }

    const handleMove= (to)=>{
        if(currentTriangleIdx !== undefined){
            Move(currentTriangleIdx, to)
            UpdatePossibleMoves();
            //updateEliminated(jsonBoard);
            const val = GetDicesValue();
            val.then((v) => {
            setDiceValues(v);
            })
            const res = GetPossibleMoves(to)
            res.then((r) => {
                console.log("setCurrentTriangleIdx " +to);
                console.log("handleTriangleClick " +to);
                setPossibleMoves(r);
                setCurrentTriangleIdx(to)
                const turn = GetIsMovesLeft()
                turn.then((t) => {
                    if(!t){
                        const winner = CheckForWinner();
                        winner.then((isWinner)=>{
                            setIsWinner(isWinner)
                        })
                        resetBoardState();
                        ChangeTurn();
                    }
                })
            })
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
            // <div>
            //     <Checker player={1}/>
            //     <div>Eaten: {numberOfWhiteEliminated}</div>
            // </div>
            <div>
                <Checker player={1}/>
                <div>Eaten: {numberOfEaten}</div>
                <div>Out Of Board: {numberOfOut}</div>
        </div>
        )
    }

    const renderBlackEaten = () => {
        return(
            // <div>
            //     <Checker/>
            //     <div>Eaten: {numberOfBlackEliminated}</div>
            // </div>
        <div>
            <Checker/>
            <div>Eaten: {numberOfEaten}</div>
            <div style={{paddingBottom:"50vh"}}>Out Of Board: {numberOfOut}</div>
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
                <div className="container-out" id="black">
                    {renderBlackEaten()}
                    {renderWhiteEaten()}
                    <div style={{width:"100px" , height:"100px",background:canDragToGoalField? "green" : "red"}} onClick={canDragToGoalField? isWhiteCheckers?()=>handleMove(27):()=>handleMove(26):{}}>
                    </div>
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
    else if(!isWinner){
        return(<h1>You Lost the Game ...</h1>)
    }
    else{
        return(<h1>Winner Winner Chicken Dinner</h1>)
    }
}

export default Board