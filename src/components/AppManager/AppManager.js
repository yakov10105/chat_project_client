import{ useEffect , useContext, useState, useMemo } from "react";
import Line from "../../layouts/Line";
import ChatManager from '../ChatManager/ChatManager';
import GameManager from '../GameManager/GameManager';
import {GameOnContext} from '../../Context/GameOnContext';
import {RoomContext} from '../../Context/RoomContext';
import {IsMyTurnContext} from '../../Context/IsMyTurnContext';

const AppManager = (props) => {
    const user = props.location.state.user;
    const [isGameOn, setIsGameOn] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [isMyTurn, setIsMyTurn] = useState(true);

    
  const value = useMemo(() => ({isGameOn, setIsGameOn}), [isGameOn, setIsGameOn])
  const roomValue = useMemo(() => ({roomName, setRoomName}), [roomName, setRoomName])
  const isMyTurnContext = useMemo(() => ({isMyTurn, setIsMyTurn}), [isMyTurn, setIsMyTurn])
  
    if(isGameOn){
        return(<div className='app_manager'>
        <Line justify="between">
            
        <IsMyTurnContext.Provider value={isMyTurnContext}>
            <RoomContext.Provider value={roomValue}>
                <GameOnContext.Provider value={value}>
                    <ChatManager user={user}></ChatManager>
                    <GameManager user={user}/>
                </GameOnContext.Provider>
            </RoomContext.Provider>
        </IsMyTurnContext.Provider>
        </Line>
    </div>)
    }
    else{
        return(<div className='app_manager'>
        <Line justify="between">
            <IsMyTurnContext.Provider value={isMyTurnContext}>
                <RoomContext.Provider value={roomValue}>
                    <GameOnContext.Provider value={value}>
                        <ChatManager user={user}></ChatManager>
                    </GameOnContext.Provider>
                </RoomContext.Provider>
            </IsMyTurnContext.Provider>
        </Line>
    </div>)
    }
}

export default AppManager