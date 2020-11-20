import React, { useState, useReducer } from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';

//Our useReducer and Context 
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';

// My Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomeGuest from '../components/HomeGuest';
import Home from '../components/Home';
import About from '../components/About';
import Terms from '../components/Terms';
import CreatePost from '../components/CreatePost';
import ViewSinglePost from '../components/ViewSinglePost';
import FlashMessages from '../components/FlashMessages';

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("socialappToken")),
    flashMessages: []
  }

  function ourReducer(state, action) {
    switch (action.type) {
      case "login":
        return {loggedIn: true, flashMessages: state.flashMessages}
      case "logout":
        return {loggedIn: false, flashMessages: state.flashMessages}
      case "flashMessages":
        return {loggedIn: state.loggedIn, flashMessage: state.flashMessages.concat(action.value)}
      default:
        break;
    }
  }

  //use Reducer instead of useState
  const [state, dispatch] = useReducer(ourReducer, initialState);

  // const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("socialappToken")));
  // const [flashMessages, setFlashMessages] = useState([]);

  // function addFlashMessage(msg) {
  //   setFlashMessages(prev => prev.concat(msg));
  // }

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
            <Switch>
              <Route path="/" exact>
                {state.loggedIn ? <Home/> : <HomeGuest/>}
              </Route>
              <Route path="/about-us" exact>
                <About/>
              </Route>
              <Route path="/terms" exact>
                <Terms/>
              </Route>
              <Route path="/create-post">
                <CreatePost/>
              </Route>
              <Route path="/post/:id">
                <ViewSinglePost/>
              </Route>
            </Switch>
          <Footer/>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

ReactDOM.render(<Main/>, document.getElementById("root"));

if (module.hot) {
  module.hot.accept()
}