import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import DispatchContext from '../app/DispatchContext';

function HeaderLoggedOut(props) {
  const appContext = useContext(DispatchContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    const postUrl = '/login';
    try {
      const response = await axios.post(postUrl, {username, password})
      if (response.data) {
        localStorage.setItem("socialappToken", response.data.token);
        localStorage.setItem("socialappUsername", response.data.username);
        localStorage.setItem("socialappAvatar", response.data.avatar);
        appContext({type: "login"});
      } else {
        console.log("incorrect username or password.")
      }
    } catch (e) {
      console.log("There was a problem!")
    }
  }

  return (
      <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
        <div className="row align-items-center">
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input onChange={(e) => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input onChange={(e) => setPassword(e.target.value)}  name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
            </div>
            <div className="col-md-auto">
              <button className="btn btn-success btn-sm">Sign In</button>
            </div>
          </div>
       </form>
  )
}

export default HeaderLoggedOut;