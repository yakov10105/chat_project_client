import { useState } from "react"
import { Form, Button } from "react-bootstrap"


const Lobby = ({joinRoom}) => {
    
    const [user, setUser] = useState('idan');
    const [room, setRoom] = useState();

    return  <Form className="lobby"
        onSubmit={e => {
            e.preventDefault();
            joinRoom(user, room);
    }}>
        <Form.Group>
            <Form.Control placeholder='room' onChange={e => setRoom(e.target.value)}/>
        </Form.Group>
        <Button variant='success' type='submit' disabled={!user || !room} > Join </Button>
    </Form>
}

export default Lobby;