import { Form} from 'react-bootstrap';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';


const SendMessageForm = ({ sendMessage, roomName }) => {

    const [message, setMessage] = useState('');
    const handleSubmit = (e)=>{
        e.preventDefault();
        sendMessage(message);
        setMessage('');
    }
    return(
        <Form
         onSubmit={handleSubmit}>
        <Grid container style={{padding: '20px'}}>
            <Grid item xs={11}>
                <TextField id="outlined-basic-email" label="Message" fullWidth 
                onChange={e => setMessage(e.target.value)} value={message}/>
            </Grid>
            <Grid xs={1} align="right">
                <Fab color="primary" type='submit' aria-label="add" disabled={roomName==="room"}><SendIcon /></Fab>
            </Grid>
        </Grid>
        </Form>
    )
}

export default SendMessageForm;