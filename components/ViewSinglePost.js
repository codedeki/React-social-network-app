import React, { useEffect, useState } from "react";
import Page from './Page';
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LoadingDotsIcon from './LoadingDotsIcon';
import ReactTooltip from 'react-tooltip';
// import ReactMarkdown from 'react-markdown'; // breaking changes: fix later

function ViewSinglePost(props) {

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
  }, [])

  if (isLoading) {
    return (
    <Page title="...">
      <LoadingDotsIcon/>
    </Page>
    )}


  const date = new Date(post.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  return (

    <Page title={post.title}>
      <div className="d-flex justify-content-between">
       <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" data-tip="Edit" data-for="edit" className="text-primary mr-2">
            <i className="fas fa-edit"></i>
          </a>
            <ReactToolTip id="edit" className="custom-tooltip"/> {" "}
          <a data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
            <i className="fas fa-trash"></i>
          </a>
            <ReactToolTip id="delete" className="custom-tooltip"/> {" "}
        </span>
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

export default ViewSinglePost;