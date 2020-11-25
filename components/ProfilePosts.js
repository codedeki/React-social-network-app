import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';

function ProfilePosts(props) {

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
  }, [])

  if(isLoading) {
    return <LoadingDotsIcon/>
  }

  return (
      <div className="list-group">
        {posts.map(post => {
          const date = new Date(post.createdDate);
          const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

           return  (
           <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong> 
            {" "}
            <span className="text-muted small">on {dateFormatted} </span>
          </Link>
        )
      })}
      </div>
  )
}

export default ProfilePosts;