import './Line.css';

const Line = (props) => {
    return (
        <div className="Line" justify={props.justify}>
            {props.children}
        </div>
    )
}

export default Line;