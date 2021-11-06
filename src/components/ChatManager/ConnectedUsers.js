import React,{useState,useEffect} from "react";
import {Grid , Divider , TextField , List,ListItem,ListItemIcon , ListItemText,Avatar, makeStyles} from '@material-ui/core'
import axios from "axios";

const useStyles = makeStyles(theme =>({
    borderRight500: {
        width:'100vh',
        borderRight: '1px solid #e0e0e0'
    }
  }));
const ConnectedUsers = (props) => {
    const [users,setUsers] = useState([])
    const [ searchResult , setSearchResult] = useState("")
    const classes = useStyles();
    
    useEffect(()=>{
        axios.get('http://localhost:8082/api/users/all',{
            headers:{
                "Authorization":localStorage.getItem('key')
            }
        }).then((res)=>{
            console.log(res.data)
            setUsers(res.data.filter((user)=>user.userName !== props.user ))
        }).catch(err=>{
            console.log(err)
        })
    },[])


    return(
            <Grid item xs={3} className={classes.borderRight500}>
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                        <Avatar alt={props.user} src="https://material-ui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText primary={props.user}>{props.user}</ListItemText>
                    </ListItem>
                </List>
                <Divider />
                <Grid item xs={12} style={{padding: '10px'}}>
                        <TextField 
                            id="outlined-basic-email" 
                            label="Search" 
                            variant="outlined" 
                            name="term"
                            value={searchResult}
                            onChange={e=>setSearchResult(e.target.value)}
                            fullWidth />
                </Grid>
                <Divider />
                <List>
                   {users &&
                        users.map((user,ix)=>{
                            return(
                                <ListItem button key={ix} onClick={()=>props.openUserChat(props.user,user)}>
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