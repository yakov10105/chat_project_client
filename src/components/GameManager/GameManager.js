import {React,useState} from 'react'
import Board from './Board/Board'
import Checker from './Checker/Checker'

const GameManager = () => {
    const [ board,setBoard] = useState()
    
    
    return (


        <div className='game_manager' 
            style={{
                'height': '80vh',
                'width': '100%',
                'background-color': 'aliceblue',
            }}>
            <Board/>

        </div>
    )
}

export default GameManager