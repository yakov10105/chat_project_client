import {Form} from 'react-bootstrap';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';


const SendMessageForm = ({ sendMessage }) => {

    const [message, setMessage] = useState('');
    const handleSubmit=(e)=>{
        e.preventDefault();
        sendMessage(message);
        setMessage("")
    }
    return(
        <Grid container style={{padding: '20px'}}>
            <Form onSubmit={handleSubmit} >
               <Grid container direction="row" justify="flex-end" alignItems="flex" spacing={1}>
                    <Grid item xs={11}>
                        <TextField 
                            id="outlined-basic-email" 
                            label="Type Something..."
                            onChange={e=>setMessage(e.target.value)}
                            value={message} 
                            />
                    </Grid>
                    <Grid xs={1} align="right">
                        <Fab color="primary"  aria-label="add" type='submit' disabled={!message}><SendIcon /></Fab>
                    </Grid>
                </Grid>
            </Form>

        </Grid>
    )
}

export default SendMessageForm;