import React,{useState,useEffect,useContext} from "react";
import {Grid , Divider , TextField , List,ListItem,ListItemIcon , ListItemText,Avatar,Button} from '@mui/material'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import axios from "axios";
import useStyles from "./hooks/useStyles";
import icon from '../../assets/game-icon.png'
import Line from "../../layouts/Line";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {UserTyping} from '../../Context/UserTyping';
import TypingBubble from '../../layout/typingBubble/typingBubble'

const INITIAL_STATE = {
    term:""
}

const ConnectedUsers = ({ user,joinRoom,closeConnection}) => {

    const [users,setUsers] = useState([])
    const [tmpUsers,setTmpUsers] = useState([])
    const [connectedUsers,setConnectedUsers] = useState([]);
    const [usersFlag,setUsersFlag] = useState(false)
    const [currentUser,setCurrentUser] = useState({})
    const {isTyping, setIsTyping} = useContext(UserTyping);
    const [values, setValues] = useState(INITIAL_STATE)
    const classes = useStyles();

    const connectToServer = async () => {
        try{
          const connection = new HubConnectionBuilder()
          .withUrl(`http://localhost:8082/login`)
          .configureLogging(LogLevel.Information)
          .build();
    
          connection.on("ConnectedUsers", (users) => {
            setConnectedUsers(users);
            console.log(connectedUsers)
          });

          connection.on("ReceiveTyping", (userName) => {
              //SetCurrentuser.username = username
          });
          
          connection.onclose(e => {
            setConnection();
            setConnectedUsers([]);
          })
    
          await connection.start();
          await connection.invoke("ConnectAsync", user);
    
          setConnection(connection);
    
        } catch(e){
          console.log(e);
        }
      }

      const sendNotifficition = async (userName) => {
        try{
            await connection.invoke("SendTyping", userName);
        } catch(e){
          console.log(e);
        }
      }

      useEffect(()=> {
          connectToServer();
    },[user])

    //#region useEffect
    //getting users from the service
    useEffect(()=> {
        getUsers();
    },[connectedUsers])

    //rerender when users changes
    useEffect(()=>{
   
    },[users])

    useEffect(()=>{
        // console.log(currentUser)
    },[currentUser])

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
        getUsers();
    },[usersFlag])
    //#endregion

    const getUsers = () =>{
        if(!usersFlag){
            axios.get('http://localhost:8082/api/users/all',{
                headers:{
                    "Authorization":localStorage.getItem('key')
                }
            }).then((res)=>{
                // console.log(res.data)
                let result =res.data.filter((u)=>u.userName !== user )
                setUsers(result);
                setTmpUsers([...result]);
              
            }).catch(err=>{
                console.log(err)
            })
        }
        else{
            let result =connectedUsers.filter((u)=>u.userName !== user )
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

    const renderTypingBubble = (user) => {
        // console.log(user)
        if(isTyping && user === currentUser){
            // constole.log('TypingBubble')
            sendNotifficition(currentUser.userName)
            return <TypingBubble/>
        } 
    }

    return(
            <Grid item xs={3} className={classes.borderRight500}>
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                        <Avatar alt={user} src="https://material-ui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText primary={user}>{user}</ListItemText>
                    </ListItem>
                </List>
                <Divider />
                <Line justify="between" >
                <Line justify="between">
                    <Tooltip title="Leave Chat">
                        <IconButton sx={{color:"#d32f2f"}} onClick={() => closeConnection(user)} aria-label="refresh">
                            <ExitToAppIcon />
                        </IconButton>
                    </Tooltip>
                    <Switch defaultChecked={usersFlag} color="warning" onChange={getCurrentUsers} />
                    </Line>
                    <Tooltip title="Invite to play">
                    <Button>
                        <Avatar src={icon}/>
                    </Button>
                    </Tooltip>
                </Line>
                <Divider />
                <Grid item xs={12} style={{padding: '10px'}}>
                        <TextField 
                            id="outlined-basic-email" 
                            label="Search" 
                            variant="outlined" 
                            name="term"
                            onChange = {handleSetValues}
                            fullWidth />
                </Grid>
                <Divider />
                <List>
                   {tmpUsers &&
                        tmpUsers.map((u,ix)=>{
                            return(
                                <ListItem button key={ix} onClick={()=>{
                                    joinRoom(user,u.userName);
                                    setCurrentUser(u);
                                    }}>
                                    <ListItemIcon>
                                        <Avatar alt={u.userName} src="https://material-ui.com/static/images/avatar/1.jpg" />
                                    </ListItemIcon>
                                    {renderTypingBubble(u)}
                                    <ListItemText primary={u.userName}>{u.userName}</ListItemText>
                                    {u.isOnline && <ListItemText secondary={"🟢"}  align="right"></ListItemText>}
                                    {!u.isOnline && <ListItemText secondary={"🔴"}  align="right"></ListItemText>}
                                </ListItem>
                            )
                        })         
                   }
                </List>
            </Grid>
    )
}
export default ConnectedUsers;