import React from 'react'
import './EndGamePage.css'
import {Button} from '@material-ui/core'
import win from '../../../sounds/win.mp3'
import lose from '../../../sounds/fail.mp3'
import useSound from 'use-sound'

const EndGamePage = ({isWinner,closeConnection}) => {
    //const [play,{stop}] = useSound(isWinner?win:lose)

    const handleOnClick =()=>{
        //stop()      
        closeConnection()
    }

    if(!isWinner){
        return(
            <div className='end-game'>
                <div className='loser'>
                    {/* {play()} */}
                    <h1>You Lost the Game ...</h1>
                    <h2 className='text'>You Lost 50 coins ...</h2>
                    <Button color='secondary' onClick={handleOnClick}>Back to Chat</Button>
                </div>
            </div>
        )
    }
    else{
        return(
            <div className='end-game'>
                    <div className='winner'>
                        {/* {play()} */}
                        <h1>You Won The Game !</h1>
                        <h2 className='text'>You Won 50 coins</h2>
                        <Button variant='contained' color='primary' onClick={handleOnClick}>Back to Chat</Button>
                    </div>
            </div>
        )
    }
}

export default EndGamePage
