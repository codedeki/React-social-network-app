import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';

function ProfileFollowing() {

  const ourRequest = axios.CancelToken.source();
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(()=> {
    const getUrl = `/profile/${username}/following`
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
        {posts.map((follower, i) => {
           return  (
           <Link key={i} to={`/post/${follower.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
          </Link>
        )
      })}
      </div>
  )
}

export default ProfileFollowing;