import React, { useState} from 'react'
import './Login.css'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { Container, Divider, Stack, TextField } from '@mui/material'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object().shape({
    userName:yup.string().required("* User Name is requierd"),
    password: yup.string().required("* Password is requierd").min(5,"* Password must be at least 5 characters")
});

const Login = () => {
    const [userName , setUserName ] = useState("")
    const [password , setPassword ] = useState("")
    const [isLoggedin , setIsLoggedIn ] = useState(false)
    const [user,setUser] = useState({})
    const {register, handleSubmit, formState: { errors }} = useForm({
        resolver:yupResolver(schema)
    })


    const sendDetails = () =>{
        axios.post('http://localhost:8082/api/auth/login',{
            UserName: userName,
            Password: password
        }).then((res)=>{
            localStorage.setItem("key",res.data.key)
            setUser(res.data.user)
            setIsLoggedIn(true);
        }).catch((err)=>{
            console.log(err)
        })
        
    }



    if (!isLoggedin) {
        return (
            <div className="Login">
               <Container maxWidth="sm" fixed="true" className="container">
               <form onSubmit={handleSubmit(sendDetails)}>
                    <Stack 
                        spacing={2}
                        divider={<Divider orientation="horizontal" flexItem />}>
                            <TextField 
                                name='userName'
                                className="field" 
                                id="outlined-basic" 
                                label="User Name" 
                                variant='filled'
                                {...register('userName')} 
                                onChange={(e)=>{setUserName(e.target.value)}}/>
                            <p>{errors['userName']?.message}</p>
                            <TextField 
                                name='password'
                                className="field" 
                                id="outlined-basic" 
                                type='password'  
                                label="Password" 
                                variant="filled"
                                {...register('password')}
                                onChange={(e)=>{setPassword(e.target.value)}}/>
                            <p>{errors['password']?.message}</p>
                            <Button className='login-btn'  variant='contained' type='submit'>Login</Button>
                            <Link className="signup-link" to="/signup">Dont have account ? click here to sign-up</Link>
                    </Stack>
               </form>
               </Container>
               <div>
                   
               <Typography className="typography_header" gutterBottom align="center" variant="h1">Backgammon</Typography>
                <Container maxWidth="2sm" fixed="true" className="container">
                    <Typography className="typography_content" gutterBottom variant="h4">
                    Backgammon offers the best backgammon game online. Play with an artificially intellegent opponent or play with a friend with Pass & Play! 247 Backgammon has games in five difficulites, ranging from easy to expert! You'll be sure to find a difficulty you feel comfortable playing, whether you are a beginner or seasoned backgammon player. Options only on 247 Backgammon include doubling cube, highlights, match points, and chip color! This backgammon site even remembers your preferences every time you come back so you'll be set to play immediately! The gameplay on 247 Backgammon is seamless and you'll quickly become addicted to the beautiful artwork and perfect puzzle game.
                    </Typography>
                    <Typography className="typography_content" gutterBottom variant="h4">
                    Backgammon is a popular ancient board game. It is played with two players (lucky you, we have a computer player to enjoy!). The object of backgammon is to move all your checkers around the board in a clockwise motion and ultimately bear off the checkers from the board. The first player to remove all their checkers is the winner.
                    </Typography>
                    <Typography className="typography_content" gutterBottom variant="h4">
                    Alternate turns with your opponent moving checkers toward your home in the upper right hand quadrant of the backgammon board. Move checkers by rolling the dice. The numbers on the dice refer to how many spaces you may move with one or more checkers. Highlights show you where the checkers can possibly move. If you roll doubles, you get to move each die twice, concluding in four moves for that turn. You may move your checkers onto any Point so long as it is occupied by your checkers, is empty, or has 1 opponent checker. You may not move your checkers onto a Point with two or more opponent checkers. If you land on a Point with one opponent checker, you knock the opponent's checker off the board and send it back to the beginning. The opponent must now roll and move into an empty spot in your home territory to get that checker back into gameplay. They may not move any other checkers until that knocked off checker is returned. Beware though! Leaving your checkers open with only one on a point leaves them open to be knocked off by your opponent as well!
                    </Typography>
                    <Typography className="typography_content" gutterBottom variant="h4">
                    Once you move all your checkers into the upper right quadrant (in the single player backgammon game), you may start bearing off. This means you can place your checkers into the slot on the right, removing them from the board. Whoever manages to do this first wins!
                    </Typography>
                    <Typography className="typography_content" gutterBottom variant="h4">
                    One to three points can be awarded during the backgammon game dependant on where the loser's checkers are on the board when the winner wins. If the losing player has not borne off any of their checkers by the time the winner has won, the winner will achieve 2 points, and is known as losing a gammon. If the losing player has not borne off any of their checkers and has checkers in the opponent's home board (lower right quadrant) or are still knocked off, the winner scores three points, which is known as losing a backgammon. The winner is awarded one point (most common) if the opponent has started to bear off their checkers and/or has all of their checkers out of the winner's home territory.
                    </Typography>
                    <Typography className="typography_content" gutterBottom variant="h4">
                    The doubling cube is a fun option for players who are seasoned backgammon aficionados. Turn this option on or off in the menu at the start of the game. It is a marker, instead of a die. At any time during gameplay a player may before his/her turn propose the game be played for twice the current stake (beginning at 2). The opponent must either accept th doubled stake or resign to defeat immediately (thus ending the game). The option to redouble belongs exclusively to the player who accepted the double. Technically, the game can be doubled up to 64 times the score, but it rarely goes beyond 4. If the "double" is declined, the doubler wins however many points the doubling cube is showing (1 x doubling cube). If the game is played, the resulting score will then be multiplied by the doubling cube number. This little die adds a lot of fun strategy to the game. We recommend trying it on for size!
                    </Typography>
               </Container>

               <Typography className="typography_header" gutterBottom align="center" variant="h1">Backgammon Game Strategy</Typography>
                <Container maxWidth="2sm" fixed="true" className="container">
                    <Typography className="typography_content" gutterBottom variant="h4">
                    Fortify your checkers in backgammon by ensuring all remain in stacks of two or more at all times.
                    </Typography>
                    <Typography className="typography_content" gutterBottom variant="h4">
                    Knock opponent backgammon checkers off as much as possible.
                    </Typography>
                    <Typography className="typography_content" gutterBottom variant="h4">
                    Build up your home territory with two checkers + in each spot. This makes it more difficult for the opponent to roll to get back into the game after being knocked off.
                    </Typography>
                    <Typography className="typography_content" gutterBottom variant="h4">
                    Feeling fiesty? Intentionally leave some checkers back to try and knock the opponent off the board as they make a run for their home territory!
                    </Typography>
               </Container>
               </div>
               
            </div>
        )
    }
    else{
        return (<Redirect
            to={{
            pathname: "/chat",
            state: { user: user }
          }}
        />)
    }
}

export default Login
