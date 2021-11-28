import React,{useState,useEffect,useContext} from "react";
import {Grid , Divider , TextField , List,ListItem,ListItemIcon , ListItemText,Avatar,Button, Snackbar, Drawer, Badge  } from '@mui/material'
import MailIcon from '@mui/icons-material/Mail'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import axios from "axios";
import Style from "./Style";
import icon from '../../../assets/GameIcon.svg'
import Line from "../../../layouts/Line";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {UserTyping} from '../../../Context/UserTyping';
import {GameOnContext} from '../../../Context/GameOnContext';
import {RoomContext} from '../../../Context/RoomContext';
import {IsMyTurnContext} from '../../../Context/IsMyTurnContext';
import {AccountConnection} from '../../../ConnectionContext/AccountConnection';
import {ChatConnection} from '../../../ConnectionContext/ChatConnection';
import {ReciverContext} from '../../../Context/ReciverUserContext';
import TypingBubble from '../../../layout/typingBubble/typingBubble'
import CloseIcon from '@mui/icons-material/Close';
import useSound from 'use-sound';
import notificationSound from '../../../sounds/Notification.mp3'
import newMessageSound from '../../../sounds/NewMessage.mp3'
import gameInvitationSound from '../../../sounds/GameInvitation.mp3'
import {useDocumentTitle} from "../../../hooks/setDocumentTitle"
import { green } from '@mui/material/colors';


const INITIAL_STATE = {
    term:""
}

const ConnectedUsers = ({ user,joinRoom,closeConnection}) => {

    const [playNewMessage] = useSound(newMessageSound)
    const [playGameInvitation] = useSound(gameInvitationSound)
    const [users,setUsers] = useState([])
    const [tmpUsers,setTmpUsers] = useState([])
    const [connectedUsers,setConnectedUsers] = useState([]);
    const [newMessages,setNewMessages] = useState([]);
    const [usersFlag,setUsersFlag] = useState(false)
    const [gameRequestSender,setGameRequestSender] = useState('')
    const [open, setOpen] = useState(false);
    const [fromRoomName, setFromRoomName] = useState('');
    const {isGameOn, setIsGameOn} = useContext(GameOnContext);
    const {isTyping, setIsTyping} = useContext(UserTyping);
    const {roomName, setRoomName} = useContext(RoomContext);
    const {isMyTurn, setIsMyTurn} = useContext(IsMyTurnContext);
    const {reciverUser, setReciverUser} = useContext(ReciverContext);
    const {accountConnection, setAccountConnection} = useContext(AccountConnection);
    const {chatConnection, setChatConnection} = useContext(AccountConnection);
    const [document_title, setDoucmentTitle] = useDocumentTitle("Shesh");
    const [values, setValues] = useState(INITIAL_STATE)
    const classes = Style();

    const connectToServer = async () => {
        try{
          const connection = new HubConnectionBuilder()
          .withUrl(`http://localhost:8082/login`)
          .configureLogging(LogLevel.Information)
          .build();
          
    
          connection.on("ConnectedUsers", (users) => {
            setConnectedUsers(users);
            // console.log(connectedUsers)
          });

          connection.on("ReceiveMessage", (room) => {
            // playNewMessage();
            setFromRoomName(room);
          });

          connection.on("ReceiveTyping", (userName) => {
            //SetCurrentuser.username = username
        });

        connection.on("GetSender", (userName) => {
            //SetCurrentuser.username = username
        });
          
        connection.on("ReceiveGameInvitation", (userName) => {
            setGameRequestSender(userName + " Invite you to play BackGammon");
            setOpen(true);
        });

        connection.on("SetGame", () => {
            setIsGameOn(true);
        });
          
          connection.onclose(e => {
            setAccountConnection();
            setConnectedUsers([]);
          });


    
          await connection.start();
          await connection.invoke("ConnectAsync", user.userName);
          await connection.invoke("ConnectAsync", user.userName);
          CheckForNewMessages(connection);
    
          setAccountConnection(connection);
    
        } catch(e){
          console.log(e);
        }
      }

      

    const setGameOn = async (currentUserName) => {
        try{
            await accountConnection.invoke("SetGameOn",{SenderUserName:user.userName, ReciverUserName:reciverUser.userName} );
        } catch(e){
        console.log(e);
        }
    }

    const sendGameRequest = async () => {
        try{
            if(!isGameOn){
            await accountConnection.invoke("SendGameRequest",{SenderUserName:user.userName, ReciverUserName:reciverUser.userName} );
            }
        } catch(e){
        console.log(e);
        }
    }

      const sendNotifficition = async (userName) => {
        try{
            console.log("e");
            await accountConnection.invoke("SendTyping", userName);
        } catch(e){
          console.log(e);
        }
      }

      const CheckForNewMessages =  async (connec, room) => {
        try{
            if(roomName !== room){
                await connec.invoke("CheckForNewMessages").then((res)=>{
                    setNewMessages(res);
                    handleDocumentTitle(res);
                });
            }
            else{
                connec.invoke("ReadUnReadMessages", roomName)
                
            }
            setFromRoomName('');
        } catch(e){
          console.log(e);
        }
      }

      useEffect(()=> {
          connectToServer();
    },[])


    useEffect(()=> {
        CheckForNewMessages(accountConnection, fromRoomName);
  },[roomName, chatConnection, fromRoomName])
    //#region useEffect
    //getting users from the service
    useEffect(()=> {
        getUsers();
    },[connectedUsers])

    //rerender when users changes
    useEffect(()=>{
        // console.log(users);
    },[users])

    //run search when the search text changes
    useEffect(()=>{
        let newUsers =  users.filter((u)=>u.userName.toLowerCase().startsWith(values.term.toLowerCase()));
        if(newUsers.length!==0){
            setTmpUsers([...newUsers])
        }
    },[values.term])

    //rerender when tmp users changed
    useEffect(()=>{
        // console.log(tmpUsers);
    },[tmpUsers])

    
    useEffect(()=>{
        joinRoom()
    },[reciverUser])

    useEffect(()=>{
        getUsers();
    },[usersFlag])
    //#endregion

    const getUsers = async () =>{
        if(!usersFlag){
            axios.get('http://localhost:8082/api/users/all',{
                headers:{
                    "Authorization":localStorage.getItem('key')
                }
            }).then((res)=>{
                const result =res.data.filter((u)=>u.userName !== user.userName )
                setUsers(result);
                setTmpUsers([...result]);
              
            }).catch(err=>{
                console.log(err)
            })
        }
        else{
            let result =connectedUsers.filter((u)=>u.userName !== user.userName )
            setUsers(result);
            setTmpUsers([...result]);
        }
    } 
    const getCurrentUsers = (e, val) =>{
        setUsersFlag(val);
    }

    const handleSetValues = (e)=>{
        const {name,value} = e.target;
       setValues(prevState=>({...prevState,[name]:value}))
    }
    
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

      const handleGameAccept = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        let userName = gameRequestSender.replace(" Invite you to play BackGammon", "")
        setGameOn(accountConnection, userName)
        setOpen(false);
        setIsMyTurn(false);
        setIsGameOn(true);
      };

      const handleDocumentTitle= (res) => { 
        let mes = 0;
        for (let i = 0; i < res.length; i++){
            mes = mes + res[i]?.numberOfNewMessages;
            console.log(i);
        }
        if(mes > 0){
            setDoucmentTitle(`Shesh (${mes})`) 
        }
        else{
            setDoucmentTitle("Shesh") 
        }
      }
    
      const action = (
        <React.Fragment>
          <Button color="secondary" size="small" onClick={handleGameAccept}>
            Accept
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );

      const renderTypingBubble = (user) => {
        // console.log(user)
        if(isTyping && user === reciverUser){
            // constole.log('TypingBubble')
            sendNotifficition(reciverUser.userName)
            return <TypingBubble/>
        } 
    }
    
    const isNewMessagesFrom = (sender) => {
                let newsender = null;
                newsender = newMessages.filter((u) => u?.senderUserName === sender.userName)
            if (newsender.length > 0) {
                return (<Badge badgeContent={newsender[0].numberOfNewMessages} color="primary">
                            <MailIcon color="action" />
                        </Badge>)
            }
    }

    return(
            <Grid item xs={3} className={classes.root}>
                <Drawer 
                    className={classes.drawer}
                    variant="permanent"
                    anchor="left"
                    classes={{ paper: classes.drawerPaper}}
                >
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                        <Avatar sx={{ bgcolor: green[700] }} alt={user.userName} src="https://material-ui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText primary={user.userName} secondary={"💰" + user.winCoins}></ListItemText>
                    </ListItem>
                </List>
                <Divider />
                <Line justify="between" >
                    <Line justify="between" >
                        <Tooltip title="Leave Chat">
                            <IconButton sx={{color:"#d32f2f"}} onClick={() => closeConnection(user.userName)} aria-label="refresh">
                                <ExitToAppIcon />
                            </IconButton>
                        </Tooltip>
                        <Switch defaultChecked={usersFlag} color="success" onChange={getCurrentUsers} />
                    </Line>
                    <Tooltip title="Invite to play">
                    <Button onClick={sendGameRequest}>
                        <Avatar src={icon}/>
                    </Button>
                    </Tooltip>
                </Line>
                <Divider />
                        <TextField 
                            id="outlined-basic-email" 
                            label="Search" 
                            variant="outlined" 
                            name="term"
                            onChange = {handleSetValues}
                            fullWidth />
                <Divider />
                <List>
                   {tmpUsers &&
                        tmpUsers.map((u,ix)=>{
                            return(
                                <ListItem button key={ix} onClick={()=>{
                                    setReciverUser(u);
                                    }}>
                                    <ListItemIcon>
                                        <Avatar alt={u.userName} src="https://material-ui.com/static/images/avatar/1.jpg" />
                                    </ListItemIcon>
                                    {renderTypingBubble(u)}
                                    <ListItemText primary={u.userName} secondary={"💰" + u.winCoins}></ListItemText>
                                    {isNewMessagesFrom(u)}
                                    {u.isOnline && <ListItemText secondary={"🟢"}  align="right"></ListItemText>}
                                    {!u.isOnline && <ListItemText secondary={"🔴"}  align="right"></ListItemText>}
                                </ListItem>
                            )
                        })         
                   }
                </List>
                </Drawer>
                <Snackbar
                open={open}
                autoHideDuration={20000}
                onClose={handleClose}
                message={gameRequestSender}
                action={action}
                />
            </Grid>
    )
}
export default ConnectedUsers;