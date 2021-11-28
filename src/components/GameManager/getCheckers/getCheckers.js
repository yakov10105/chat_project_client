import React from 'react';
import Checker from '../Checker/Checker';

const getCheckers = (player, numberOfCheckers) => {

    if (player && numberOfCheckers) {
         const checkers = [];

        //Get checkers
        for (let i = 0; i < numberOfCheckers; i++) {         
                checkers.push(<Checker player={player}/>);                
        }

        return checkers
    } else {
        return null;
    }
}

export default getCheckers;