import { useEffect, useRef } from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import useStyles from "./hooks/useStyles";

const MessageContainer = ({ messages }) => {
    const messageRef = useRef();
    const classes = useStyles();

    useEffect(() => {
        if (messageRef && messageRef.current) {
            const { scrollHeight, clientHeight } = messageRef.current;
            messageRef.current.scrollTo({ left: 0, top: scrollHeight - clientHeight, behavior: 'smooth' });
        }
    }, [messages]);


    return (
        // <div ref={messageRef} className="message-container">
        //     {messages.map((m, index) => 
        //         <div key={index} className="user-message">
        //             <div className="message bg-primary">{m.message}</div>
        //             <div className="from-user">{m.user}</div>
        //         </div>
        //     )}
        // </div>
        <List className={classes.messageArea}>
            <ListItem key="1">
                <Grid container>
                    <Grid item xs={12}>
                        <ListItemText align="right" primary="Hey man, What's up ?"></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                        <ListItemText align="right" secondary="09:30"></ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem key="2">
                <Grid container>
                    <Grid item xs={12}>
                        <ListItemText align="left" primary="Hey, Iam Good! What about you ?"></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                        <ListItemText align="left" secondary="09:31"></ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem key="3">
                <Grid container>
                    <Grid item xs={12}>
                        <ListItemText align="right" primary="Cool. i am good, let's catch up!"></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                        <ListItemText align="right" secondary="10:30"></ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
        </List>
    )
}

export default MessageContainer;