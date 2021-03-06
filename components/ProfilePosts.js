import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';
import Post from "./Post";

function ProfilePosts() {

  const ourRequest = axios.CancelToken.source();
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(()=> {
    const getUrl = `/profile/${username}/posts`
    async function fetchPosts() {
      try {
        const response = await axios.get(getUrl, {cancelToken: ourRequest.token})
        setPosts(response.data)
        setIsLoading(false);
      } catch (err) {
        console.log("There was a problem")
      }
    }
    fetchPosts();
     //Cleaning up: to prevent memory leaks run return when componment is unmounted(cancel fetch)
    return () => {
      ourRequest.cancel();
    }
  }, [username])

  if(isLoading) {
    return <LoadingDotsIcon/>
  }

  return (
      <div className="list-group">
        {posts.length > 0 && posts.map(post => {
          return <Post noAuthor={true} post={post} key={post._id}/>
      })}
      </div>
  )
}

export default ProfilePosts;