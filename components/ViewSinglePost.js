import React, { useContext, useEffect, useState } from "react";
import Page from './Page';
import { useParams, Link, withRouter } from "react-router-dom";
import axios from "axios";
import LoadingDotsIcon from './LoadingDotsIcon';
import ReactTooltip from 'react-tooltip';
import NotFound from "./NotFound";
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
// import ReactMarkdown from 'react-markdown'; // breaking changes: fix later

function ViewSinglePost(props) {

  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const {id} = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(()=> {

    const ourRequest = axios.CancelToken.source();
    const getUrl = `/post/${id}`;

    async function fetchPost() {
      try {
        const response = await axios.get(getUrl, { cancelToken: ourRequest.token })
        setPost(response.data)
        setIsLoading(false);
      } catch (err) {
        console.log("There was a problem or the request was cancelled")
      }
    }
    fetchPost();
    //Cleaning up: to prevent memory leaks run return when componment is unmounted(cancel fetch)
    return () => {
      ourRequest.cancel();
    }
  }, [id])

  if (!isLoading && !post) {
    return <NotFound/>
  }

  if (isLoading) {
    return (
    <Page title="...">
      <LoadingDotsIcon/>
    </Page>
    )}


  const date = new Date(post.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  function isOwner() {
    if (appState.loggedIn)  {
      return appState.user.username == post.author.username
    } else 
      return false
  }

  async function deleteHandler() {
    const deleteUrl = `/post/${id}`
    const areYouSure = window.confirm("Do you really want to delete this post?")
    if (areYouSure) {
      try {
        const response = await axios.delete(deleteUrl, { data: {token: appState.user.token }})
        if (response.data == "Success") {
          appDispatch({type: "flashMessage", value: "Post was successfully deleted."})
          //redirect to user profile
          props.history.push(`/profile/${appState.user.username}`)
        }
      } catch (err) {
        console.log("There was a problem")
      }
    }
  }

  return (

    <Page title={post.title}>
      <div className="d-flex justify-content-between">
       <h2>{post.title}</h2>
       {/* Hide edit/delete buttons unless logged in as post author */}
        {isOwner() && (
           <span className="pt-2">
           <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
             <i className="fas fa-edit"></i>
           </Link>
             <ReactTooltip id="edit" className="custom-tooltip"/> {" "}
           <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
             <i className="fas fa-trash"></i>
           </a>
             <ReactTooltip id="delete" className="custom-tooltip"/> {" "}
         </span>
        )}
       
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        {/* <ReactMarkdown source={post.body} allowedTypes={["paragraph", "strong", "emphasis", "text", "heading", "list", "listItem"]} /> */}
        {post.body}
      </div>
    </Page>
  )
}

export default withRouter(ViewSinglePost);