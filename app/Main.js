import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import {BrowserRouter, Switch, Route, withRouter} from 'react-router-dom'
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';

//Our useReducer and Context 
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

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
import Profile from '../components/Profile';
import EditPost from '../components/EditPost';
import NotFound from "../components/NotFound";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("socialappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar")
    }
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data
        return
        // return {loggedIn: true, flashMessages: state.flashMessages}
      case "logout":
        // return {loggedIn: false, flashMessages: state.flashMessages}
        draft.loggedIn = false
        draft.user = {
          username: "",
          token: "",
          avatar: ""
        }
        window.location.href = "/"
        return
      case "flashMessage":
        // return {loggedIn: state.loggedIn, flashMessages: state.flashMessages.concat(action.value)}
        draft.flashMessages.push(action.value)
        return
    }
  }

  //use Reducer instead of useState
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("socialappToken", state.user.token);
      localStorage.setItem("socialappUsername", state.user.username);
      localStorage.setItem("socialappAvatar", state.user.avatar);
    } else {
      //remove local storage info upon logout
      localStorage.removeItem("socialappToken");
      localStorage.removeItem("socialappUsername");
      localStorage.removeItem("socialappAvatar");
    }
  }, [state.loggedIn])

  // Check if token has expired or not on first render
  // useEffect(() => {
  //   if (state.loggedIn) {
  //     const ourRequest = axios.CancelToken.source();
  //     async function fetchResults() {
  //       try {
  //         const response = await axios.post('/checkToken', { token: state.user.token }, { cancelToken: ourRequest.token });
  //         if (!response.data) {
  //           //token no longer valid
  //           dispatch({ type: 'logout' });
  //           dispatch({ type: 'flashMessage', value: 'Your session has expired. Please log in again.' });
  //         }
  //       } catch (error) {
  //         console.log('There was a problem or the request was canceled');
  //       }
  //     }
  //     fetchResults();
  //     return () => ourRequest.cancel();
  //   }
  // }, []);

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
              <Route path="/profile/:username">
                {state.loggedIn ? <Profile/> : <HomeGuest/>}
              </Route>
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
                {state.loggedIn ? <CreatePost/> : <HomeGuest/>}
              </Route>
              <Route path="/post/:id/edit" exact>
                {state.loggedIn ? <EditPost/> : <HomeGuest/>}
              </Route>
              <Route path="/post/:id" exact>
                {state.loggedIn ? <ViewSinglePost/> : <HomeGuest/>}
              </Route>
              <Route>
                <NotFound/>
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