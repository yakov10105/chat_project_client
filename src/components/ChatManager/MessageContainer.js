import { useEffect, useRef } from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import './MessageContainer.css';
import { Divider, makeStyles } from "@material-ui/core";


const useStyles= makeStyles(theme=>({
    messaage_area:{
        padding:'30px',
        height: '70vh',
        overflowY:'auto'
    },
    list_item:{

    }
}));
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
        if(username === user){
            return "sender"
        }
        if(username === "MyChat Bot"){
            return "bot"
        }
        return "reciever"
    }


    return (
        <List className={classes.messaage_area} ref={messageRef}>
            {messages.map((m, index) => 
                 <div key={index} className={messageIsFromUser(m.user)}>
                    <ListItem className={classes.list_item} key={index}>
                        <Grid container>
                            <Grid item xs={12}>
                                <ListItemText  primary={m.message}></ListItemText>
                            </Grid>
                            <Grid item xs={12}>
                                <ListItemText className="from"  secondary={m.user}></ListItemText>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                 </div>
             )}
        </List>
    )
}

export default MessageContainer;