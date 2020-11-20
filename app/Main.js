import React, { useState } from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';

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
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("socialappToken")));
  const [flashMessages, setFlashMessages] = useState([]);

  function addFlashMessage(msg) {
    setFlashMessages(prev => prev.concat(msg));
  }

  return (
    <BrowserRouter>
      <FlashMessages messages={flashMessages} />
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
        <Switch>
          <Route path="/" exact>
            {loggedIn ? <Home/> : <HomeGuest/>}
          </Route>
          <Route path="/about-us" exact>
            <About/>
          </Route>
          <Route path="/terms" exact>
            <Terms/>
          </Route>
          <Route path="/create-post">
            <CreatePost addFlashMessage={addFlashMessage}/>
          </Route>
          <Route path="/post/:id">
            <ViewSinglePost/>
          </Route>
        </Switch>
      <Footer/>
    </BrowserRouter>
  )
}

ReactDOM.render(<Main/>, document.getElementById("root"));

if (module.hot) {
  module.hot.accept()
}