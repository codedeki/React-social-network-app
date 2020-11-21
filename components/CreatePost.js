import React, { useEffect, useState, useContext } from "react";
import Page from '../components/Page';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import DispatchContext from '../app/DispatchContext';
import StateContext from '../app/StateContext';

function CreatePost(props) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  
  async function handleSubmit(e) {
    e.preventDefault();
    const postUrl = "/create-post";
    try {
      const response = await axios.post(postUrl, {title, body, token: appState.user.token});
      appDispatch({type: "flashMessage", value: "Congrats, you created a new post!"})
      props.history.push(`/post/${response.data}`)
      console.log("new post created")
    } catch (e) {
      console.log("There was a problem")
    }
  }

  return (
    <Page title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={e=> setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={e=> setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  )
}

export default withRouter(CreatePost);