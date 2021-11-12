import React,{useState,useEffect,useContext} from "react";
import {Grid , Divider , TextField , List,ListItem,ListItemIcon , ListItemText,Avatar,Button} from '@material-ui/core'
import {UsersContext } from '../../Context/UsersContext' 
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import axios from "axios";
import useStyles from "./hooks/useStyles";
import icon from '../../assets/game-icon.png'
import Line from "../../layouts/Line";
import SyncIcon from '@mui/icons-material/Sync';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { deepOrange } from "@material-ui/core/colors";

const INITIAL_STATE = {
    term:""
}

const ConnectedUsers = ({ user,joinRoom,closeConnection}) => {

    const [users,setUsers] = useState([])
    const [tmpUsers,setTmpUsers] = useState([])
    const [usersFlag,setusersFlag] = useState(false)
    const [values, setValues] = useState(INITIAL_STATE)
    const {connectedUsers,setConnectedUsers} = useContext(UsersContext);
    const classes = useStyles();

    //#region useEffect
    //getting users from the service
    useEffect(()=> getUsers(),[connectedUsers])

    //rerender when users changes
    useEffect(()=>{
   
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
        console.log(tmpUsers);
    },[tmpUsers])
    //#endregion

    const getUsers = () =>{
        axios.get('http://localhost:8082/api/users/all',{
            headers:{
                "Authorization":localStorage.getItem('key')
            }
        }).then((res)=>{
            console.log(res.data)
            let result =res.data.filter((u)=>u.userName !== user )
            setUsers(result);
            setTmpUsers([...result]);
          
        }).catch(err=>{
            console.log(err)
        })
    }

    const handleSetValues = (e)=>{
        const {name,value} = e.target;
       setValues(prevState=>({...prevState,[name]:value}))
    }

    return(
            <Grid item xs={3} className={classes.borderRight500}>
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                        <Avatar alt={user} sx={{ bgcolor: deepOrange[500] }} src="https://material-ui.com/static/images/avatar/1.jpg" />
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
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => getUsers()} aria-label="refresh">
                            <SyncIcon />
                        </IconButton>
                    </Tooltip>
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
                                <ListItem button key={ix} onClick={()=>{joinRoom(user,u.userName)}}>
                                    <ListItemIcon>
                                        <Avatar alt={u.userName} src="https://material-ui.com/static/images/avatar/1.jpg" />
                                    </ListItemIcon>
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