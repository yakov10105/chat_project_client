import React,{useState} from 'react'
import Data from './Fields.json'
import Triangle from './Triangle/Triangle'
import './Board.css'

const Board = () => {
    const [list, setList] = useState(Data); 

    const renderTriangle = (array) => {
        return array.map(l=> {
            return (
                <div className="tria_container">
                    <Triangle color={l.color} position={l.position}/>
                </div>
            )
        })
    }
    return (
        <div id="game_board" className="container-fluid">

            <div id="leftSide" className="row">
                <div className="blocksUp">
                    {renderTriangle(Data.LeftUp)}
                </div>
                <div className="blocksDown">
                    {renderTriangle(Data.LeftDown)}
                </div>
            </div>

            <div id="rightSide" className="row">
                <div className="blocksUp">
                    {renderTriangle(Data.RightUp)}
                </div>
                <div className="blocksDown">
                    {renderTriangle(Data.RightDown)}
                </div>
            </div>
            
        </div>
    )
}

export default Board