import React,{useEffect, useState} from 'react'
import Data from './Fields.json'
import Checker from '../Checker/Checker'
import Triangle from './Triangle/Triangle'
import getCheckers from '../getCheckers/getCheckers'
import './Board.css'
import axios from 'axios'

const Board = ({getBoard,board}) => {
    //const [serverGameBoard,setServerGameBoard] = useState({})
    //const [ board,setBoard] = useState({});
    const [rightUpList,setRightUpList]= useState([])
    const [leftUpList,setLeftUpList]= useState([])
    const [leftDownList,setLeftDownList]= useState([])
    const [rightDownList,setRightDownList]= useState([])
    const jsonBoard = JSON.parse(board) 
    
    useEffect(()=>{
            //setBoard(res)
            setLeftDownList(jsonBoard.BoardFields.filter((f)=>f.position<=5))
            setRightDownList(jsonBoard.BoardFields.filter((f)=>f.position>5 && f.position<=11))
            setRightUpList(jsonBoard.BoardFields.filter((f)=>f.position>11 && f.position<=17))
            setLeftUpList(jsonBoard.BoardFields.filter((f)=>f.position >17))



    },[board])
    
    
    
    const handleOnClick=(e)=>{
        axios
        .get(`http://localhost:8082/api/game/get-moves?pos=${e}`)
        .then((res)=>{
            console.log(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    
    const renderTriangle = (array,index) => {
        return array.map((f,idx)=> {
            let position,color,number,player;
		
            if(f.position>=0 && f.position<=11) 
                position="bottom"
            else 
                position="top"
            
            if(f.position%2 === 0)
                color= "1"
            else
                color= "2"	
            
            if(f.checkers.length>0)
                if(f.checkers[0].player.id=== jsonBoard.Player1.id){
                    player=1

                }
                else
                    player=2
                
            number = f.checkers.length
            
          return (
                <div className={"tria_container " + position} id={index+idx} onClick={()=>handleOnClick(index+idx)} >
                    <Triangle id={index+idx} color={color}  position={position}>
                        {getCheckers(player,number)}
                    </Triangle>
                </div>
            )
        })
    }
    return (
        <div id="game_board" className="container-fluid">

            <div id="leftSide" className="row">
                <div className="blocksUp">
                    {renderTriangle(leftUpList,18)}
                </div>
                <div className="blocksDown">
                    {renderTriangle(leftDownList,0)}
                </div>
            </div>

            <div id="rightSide" className="row">
                <div className="blocksUp">
                    {renderTriangle(rightUpList,12)}
                </div>
                <div className="blocksDown">
                    {renderTriangle(rightDownList,6)}
                </div>
            </div>

        </div>
    )
}

export default Board