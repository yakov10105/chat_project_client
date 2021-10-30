import { Switch ,Route,Redirect} from 'react-router';
import './App.css';
import Login from './components/login/Login';
import SignUp from './components/signup/SignUp';
import Header from './layout/header/Header'
import Footer from './layout/footer/Footer'

function App() {
  return (
    <div className="App">
      <Header/>
      <Switch>
          <Route path='/login' component={Login}></Route>
          <Route path='/signup' component={SignUp}></Route>
          <Redirect to='/'/>
      </Switch>
      <Footer/>
    </div>
  );
}

export default App;
