import { Form, InputGroup,  FormControl} from 'react-bootstrap';
import {Button} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';


const SendMessageForm = ({ sendMessage }) => {

    const [message, setMessage] = useState('');
    return(
        // <Form
        // onSubmit={e => {
        //     e.preventDefault();
        //     sendMessage(message);
        //     setMessage('');
        // }}>
        //     <InputGroup>
        //         <FormControl style={{width:400, height:30}} type="user" placeholder="message..."
        //         onChange={e => setMessage(e.target.value)} value={message} />  
        //         <Button style={{width:100, height:30}} variant="contined" type='submit' disabled={!message} endIcon={<SendIcon />}>Send</Button>
        //     </InputGroup>
        // </Form>
        <Grid container style={{padding: '20px'}}>
            <Grid item xs={11}>
                <TextField id="outlined-basic-email" label="Type Something" fullWidth />
            </Grid>
            <Grid xs={1} align="right">
                <Fab color="primary"  aria-label="add"><SendIcon /></Fab>
            </Grid>
        </Grid>
    )
}

export default SendMessageForm;