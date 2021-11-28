import{ useEffect , useContext, useState, useMemo } from "react";
import Line from "../../layouts/Line";
import {Grid} from '@mui/material';
import ChatManager from '../ChatManager/ChatManager';
import GameManager from '../GameManager/GameManager';
import {GameOnContext} from '../../Context/GameOnContext';
import {ReciverContext} from '../../Context/ReciverUserContext';
import {RoomContext} from '../../Context/RoomContext';
import {IsMyTurnContext} from '../../Context/IsMyTurnContext';
import {ChatConnection} from '../../ConnectionContext/ChatConnection';
import {AccountConnection} from '../../ConnectionContext/AccountConnection';
import LogoutButton from '../Logout/LogoutButton';

const AppManager = (props) => {
    const user = props.location.state.user;
    const [reciverUser, setReciverUser] = useState(false);
    const [isGameOn, setIsGameOn] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [isMyTurn, setIsMyTurn] = useState(true);
    const [chatConnection, setChatConnection] = useState();
    const [accountConnection, setAccountConnection] = useState();

    
  const value = useMemo(() => ({isGameOn, setIsGameOn}), [isGameOn, setIsGameOn])
  const reciver = useMemo(() => ({reciverUser, setReciverUser}), [reciverUser, setReciverUser])
  const roomValue = useMemo(() => ({roomName, setRoomName}), [roomName, setRoomName])
  const isMyTurnContext = useMemo(() => ({isMyTurn, setIsMyTurn}), [isMyTurn, setIsMyTurn])
  const chatConnectionContext = useMemo(() => ({chatConnection, setChatConnection}), [chatConnection, setChatConnection])
  const accountConnectionContext = useMemo(() => ({accountConnection, setAccountConnection}), [accountConnection, setAccountConnection])
  
    if(isGameOn){
        return(<Grid container>
            <IsMyTurnContext.Provider value={isMyTurnContext}>
                <ChatConnection.Provider value={chatConnectionContext}>
                    <AccountConnection.Provider value={accountConnectionContext}>
                        <RoomContext.Provider value={roomValue}>
                            <ReciverContext.Provider value={reciver}>
                                <GameOnContext.Provider value={value}>
                                    <LogoutButton/>
                                    <Grid item>
                                        <ChatManager user={user}/>
                                    </Grid>
                                    <Grid item sx={12}>
                                        <GameManager user={user}/>
                                    </Grid>
                                </GameOnContext.Provider>
                            </ReciverContext.Provider>
                        </RoomContext.Provider>
                    </AccountConnection.Provider>  
                </ChatConnection.Provider>
            </IsMyTurnContext.Provider>
    </Grid>)
    }
    else{
        return(<div className='app_manager'>
        <Line justify="between">
            <IsMyTurnContext.Provider value={isMyTurnContext}>
                <ChatConnection.Provider value={chatConnectionContext}>
                    <AccountConnection.Provider value={accountConnectionContext}>
                        <RoomContext.Provider value={roomValue}>
                            <ReciverContext.Provider value={reciver}>
                                <GameOnContext.Provider value={value}>
                                    <LogoutButton/>
                                    <ChatManager user={user}></ChatManager>
                                </GameOnContext.Provider>
                            </ReciverContext.Provider>
                        </RoomContext.Provider>
                    </AccountConnection.Provider>
                </ChatConnection.Provider>  
            </IsMyTurnContext.Provider>
        </Line>
    </div>)
    }
}

export default AppManager