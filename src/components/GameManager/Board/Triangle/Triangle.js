import React from 'react';
import './Triangle.css';

const Triangle = (props) => {

    let classOrientation = '';
    let classColor = '';
    let classReceivable = '';
    let pointContainerClasses = '';


    if (props.position === "top") {
        classOrientation = "Up";
    }
    else {
        classOrientation = "Down";
        pointContainerClasses = " pointContainerDown";
    }

    if (props.color !== "1") {
        classColor += "C2";
    }

    if (props.canReceive) {
        pointContainerClasses += ' containerClickable';
        classReceivable = 'Receivable';
        classColor = '';
    }
    if (props.canMove) {
        pointContainerClasses += ' containerClickable';
    }

    return (
        <div className="triangle col-xs-2 ">
            <div className={"trianglePart triangleLeft" + classOrientation + classColor + classReceivable}></div>
            <div className={"trianglePart triangleRight" + classOrientation + classColor + classReceivable}></div>
            <div className={"pointContainer " + pointContainerClasses}>
                {props.children}
            </div>
        </div>

    );

}

export default Triangle;