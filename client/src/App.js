import React, { createContext,  useEffect,  useReducer } from 'react';
import Navbar from './components/Navbar'
import './App.css'
import Home from './components/screen/Home'
import SignIn from './components/screen/SignIn'
import SignUp from './components/screen/SignUp'
import Profile from './components/screen/Profile'
import CreatePost from './components/screen/CreatePost'
import UserProfile from './components/screen/UserProfile'
import {reducer,initialState} from './components/reducer/userReducer';

import {BrowserRouter,Switch,Route, useHistory} from 'react-router-dom'
import { useContext } from 'react';

export const userContext=createContext();

const Routing=()=>{
  const history=useHistory();
  const {state,dispatch}=useContext(userContext)
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('user'));

    if(user)
    {
      dispatch({type:"USER",payload:user});
      // history.push('/');
      
    }
    else{
      history.push('/signin')
    }
  },[])
  return(
    <Switch>
    <Route exact path='/' component={Home}/>
    <Route path='/signin' component={SignIn}/>
    <Route path='/signup' component={SignUp}/>
    <Route path='/createpost' component={CreatePost}/>
    <Route exact path='/profile' component={Profile}/>
    <Route exact path='/profile/:id' component={UserProfile}/>
    
  </Switch>
  )
}


function App() {

  const [state,dispatch]=useReducer(reducer,initialState); // assume equivalent to use State;

  return (
    
    <userContext.Provider value={{state:state,dispatch:dispatch}} >
    <BrowserRouter>
    <Navbar/>
    <Routing/>
    </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
