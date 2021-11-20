import React from 'react'
import Dice from '../Dice/Dice'

const DiceCup = (props) => {

    const renderDices = () => {
        // console.log("DiceCup Call");
        return (
            props.diceValues.map((v,idx) =>{
                // console.log(v + " DiceValues");
                return (
                    <Dice number={v} key={idx}/>
                    
                )
            })
            )
    }

    return (
        <div className="dice_cup" style={{
            width:"100%"
        }}>
            {renderDices()}
        </div>
    )
}

export default DiceCup; 
