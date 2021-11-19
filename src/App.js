import { Switch ,Route} from 'react-router';
import React, { useState, useMemo, useEffect} from 'react';
import './App.css';
import Login from './components/login/Login';
import SignUp from './components/signup/SignUp';
import ChatManager from './components/ChatManager/ChatManager';
import GameManager from './components/GameManager/GameManager';
import AppManager from './components/AppManager/AppManager';
import UnAuthorizedPage from './components/UnAuthorizedPage'
import Footer from './layout/footer/Footer'
import TypingBubble from './layout/typingBubble/typingBubble'
import ProtectedRoute from './components/Routing/ProtectedRoute';

function App() {

  return (
    <div className="App">
      <div className="components">
      <Switch>
          <Route path='/login' component={Login} ></Route>
          <Route path='/signup' component={SignUp}></Route>
          <ProtectedRoute path='/chat' component={ChatManager} ></ProtectedRoute>
          <Route path='/app' component={AppManager} ></Route>
          <Route path='/Game' component={GameManager} ></Route>
          <Route exact path='/unauthorized' component={UnAuthorizedPage}/>
          <Route to='/' component={Login}/>
        </Switch>
      </div>
     <Footer/>
    </div>
  );
}

export default App;
