import React,{useState,useEffect} from "react";
import useStyles from "./hooks/useStyles";
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import axios from "axios";
import Avatar from '@material-ui/core/Avatar';


const ConnectedUsers = ({ user,openChat}) => {
    const [users,setUsers] = useState([])
    const classes = useStyles();

    //need to add search functionallity

    useEffect(()=>{
        axios.get('http://localhost:8082/api/users/all',{
            headers:{
                "Authorization":localStorage.getItem('key')
            }
        }).then((res)=>{
            console.log(res.data)
            setUsers(res.data.filter((u)=>u.userName !== user ))
        }).catch(err=>{
            console.log(err)
        })
    },[])

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
                <Grid item xs={12} style={{padding: '10px'}}>
                    <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                </Grid>
                <Divider />
                <List>
                   {users && 
                        users.map((user,ix)=>{
                            return(
                                <ListItem button key={ix} onClick={()=>openChat(user,user)}>
                                    <ListItemIcon>
                                        <Avatar alt={user.userName} src="https://material-ui.com/static/images/avatar/1.jpg" />
                                    </ListItemIcon>
                                    <ListItemText primary={user.userName}>{user.userName}</ListItemText>
                                    {user.isOnline && <ListItemText secondary="online" align="right"></ListItemText>}
                                </ListItem>
                            )
                        })
                   
                   }
                </List>
            </Grid>
    )
}
export default ConnectedUsers;