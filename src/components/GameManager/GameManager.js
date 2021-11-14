import React from 'react'
import Checker from './Checker/Checker'

const GameManager = () => {
    return (
        <div className='error-page' 
            style={{
                'height': '50vh',
                'width': '100%',
                'background-color': 'aliceblue',
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center',
                'opacity': '0.6',
            }}>
            <h1>Game.</h1>
            <Checker player={1} canMove={1}/>
        </div>
    )
}

export default GameManager