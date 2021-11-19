import React from 'react';
import './DiceArea.css';

import DiceCup from './DiceCup/DiceCup';
import RollButton from './RollButton/RollButton';

const DiceArea = (props) => {

    // const dice = props.dice.map((number, index) => {
    //     if (number === 0) {
    //         return <RollButton label="Roll Dice" key={'RollButton' + index} clicked={props.clicked} />
    //     }
    //     else {
    //         return <Dice diceNumber="index" number={number} key={'dice' + index} />
    //     }
    // });

    const renderDices = () => {
        console.log("renderDices")
        if (!props.diceValues) {
            return <RollButton label="Roll Dice" clicked={props.clicked} />
        }
        else {
            return <DiceCup diceValues={props.diceValues} />
        }
    }
    
    // let  noMove = null;
    // if (props.gameStatus === 50){
    //     noMove = <RollButton label="No Moves available" />;
    // }

    return (
        <div className="diceArea">
            {renderDices()}
        </div>
    )
}

export default DiceArea