import { useState, useEffect } from "react"
import { Form, Button } from "react-bootstrap"


const Lobby = (props) => {
    const [room, setRoom] = useState();

    useEffect(()=>{
        props.joinRoom(props.user, "room");
    },[])

    return  <Form className="lobby"
        onSubmit={e => {
            e.preventDefault();
            props.joinRoom(props.user, room);
    }}>
        <Form.Group>
            <Form.Control placeholder='room' onChange={e => setRoom(e.target.value)}/>
        </Form.Group>
        <Button variant='success' type='submit' disabled={!props.user || !room} > Join </Button>
    </Form>
}

export default Lobby;