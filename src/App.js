import { Switch ,Route} from 'react-router';
import React, { useState, useMemo, useEffect} from 'react';
import './App.css';
import Login from './components/login/Login';
import SignUp from './components/signup/SignUp';
import ChatManager from './components/ChatManager/ChatManager';
import UnAuthorizedPage from './components/UnAuthorizedPage'
import {  HubConnectionBuilder, JsonHubProtocol, LogLevel } from "@microsoft/signalr";
import Header from './layout/header/Header'
import Footer from './layout/footer/Footer'
import ProtectedRoute from './components/Routing/ProtectedRoute';
import {UserContext} from './Context/UserContext';
import {UsersContext} from './Context/UsersContext';

function App() {
  const [user, setUser] = useState(null); 
  const [connectedUsers, setConnectedUsers] = useState([]); 
  const [connection, setConnection] = useState(); 

  const connectToServer = async () => {
    try{
      const connection = new HubConnectionBuilder()
      .withUrl(`http://localhost:8082/login`)
      .configureLogging(LogLevel.Information)
      .build();

      

      connection.onclose(e => {
        setConnection();
        //Disconect From Server
      })

      await connection.start();
      await connection.invoke("ConnectAsync", user.userName);
      await connection.invoke("UpdateUsersAsync");

      connection.on("UpdateUsers", () => {
        setConnectedUsers(connection.invoke("GetConnectedUsersAsync"));
        debugger;
      });

      setConnection(connection);
      setConnectedUsers(connection.invoke("GetConnectedUsersAsync"));

    } catch(e){
      console.log(e);
    }
  }
  
  const value = useMemo(() => ({user, setUser}), [user, setUser], ({connectedUsers, setConnectedUsers}), [connectedUsers, setConnectedUsers])

  useEffect(()=>{
    connectToServer();
  },[value])

  return (
    <div className="App">
      <Header/>
          <UserContext.Provider value={value}>
      <Switch>
            <Route path='/login' component={Login} ></Route>
            <Route path='/signup' component={SignUp}></Route>
            <ProtectedRoute path='/chat' component={ChatManager} ></ProtectedRoute>
            <Route exact path='/unauthorized' component={UnAuthorizedPage}/>
            <Route to='/' component={Login}/>
      </Switch>
          </UserContext.Provider>
      <Footer/>
    </div>
  );
}

export default App;
