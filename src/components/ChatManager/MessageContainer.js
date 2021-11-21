import { useEffect, useRef } from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import useStyles from "./hooks/useStyles";
import './MessageContainer.css';
import Line from "../../layouts/Line";
import TextField from '@mui/material/TextField';
import { withWidth } from "@material-ui/core";

const MessageContainer = ({ messages, user }) => {
    const messageRef = useRef();
    const classes = useStyles();

    useEffect(() => {
        if (messageRef && messageRef.current) {
            const { scrollHeight, clientHeight } = messageRef.current;
            messageRef.current.scrollTo({ left: 0, top: scrollHeight - clientHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const messageIsFromUser = (username) => {
        // if(username=== "MyChat Bot"){
        //     return "center";
        // }
        if(username === user){
            return "right"
        }
        return "left"
    }


    return (
        <List className={classes.messageArea} ref={messageRef}>
            {messages.map((m, index) => 
                 <div key={index} className={messageIsFromUser(m.user)+" msg_box"}>
                    <ListItem key={index}>
                        <Grid container>
                            <Grid item xs={12}>
                                <ListItemText xs={{backgroundColor:"#ffff00"}}  primary={
                                    <TextField
                                    multiline
                                    maxRows={10}
                                    value={m.message}
                                    variant="outlined"
                                    aria-readonly
                                    />}>
                                </ListItemText>
                            </Grid>
                            <Grid item xs={12}>
                                <Line justify='between'>
                                    <ListItemText align='left' secondary={m.user}></ListItemText>
                                    <ListItemText align='right' secondary={m.date}></ListItemText>
                                </Line>
                            </Grid>
                        </Grid>
                    </ListItem>
                 </div>
             )}
        </List>
    )
}

export default MessageContainer;