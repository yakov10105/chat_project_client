import { useEffect, useRef, useContext } from "react";
import {Grid , Divider , TextField , List,ListItem,ListItemIcon , ListItemText,Avatar,  } from '@mui/material'
import { purple, blue, green, orange, red } from '@mui/material/colors'
import Style from "./Style";
import './MessageContainer.css';
import Line from "../../../layouts/Line";
import {ReciverContext} from '../../../Context/ReciverUserContext';
import { withWidth } from "@material-ui/core";

const MessageContainer = ({ messages, user }) => {
    const messageRef = useRef();
    const classes = Style();
    const {reciverUser, setReciverUser} = useContext(ReciverContext);

    useEffect(() => {
        if (messageRef && messageRef.current) {
            const { scrollHeight, clientHeight } = messageRef.current;
            messageRef.current.scrollTo({ left: 0, top: scrollHeight - clientHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const messageIsFromUser = (username) => {
        if(username === user){
            return "right"
        }
        return "left"
    }


    const colours = [blue[800], green[500], orange[500], purple[800], red[800]];
    const getColour = () => colours[Math.floor(Math.random() * colours.length)];

    return (
        
        <Grid item xs={11}>
        <List className={classes.messageArea} ref={messageRef}><List>
                    <ListItem button key="RemySharp" className={classes.messageAreaHeader}>
                        <ListItemIcon>
                            <Avatar style={{backgroundColor: getColour()}} alt={reciverUser.userName} src="https://material-ui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText primary={reciverUser.userName}></ListItemText>
                    </ListItem>
                </List>
                <Divider style={{ background: 'black', marginBottom:"10px" }}/>
            {messages.map((m, index) => 
                 <div key={index} className={messageIsFromUser(m.user)+" msg_box"}>
                    <ListItem key={index}>
                        <Grid container>
                            <Grid item xs={12}>
                                <ListItemText primary={
                                    <TextField
                                    variant="standard"
                                    InputProps={{ disableUnderline: true }}
                                    multiline
                                    fullWidth
                                    maxRows={100}
                                    value={m.message}
                                    aria-readonly />} >
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
        </Grid>
    )
}

export default MessageContainer;