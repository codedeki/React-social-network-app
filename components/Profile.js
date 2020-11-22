import React, { useEffect, useContext, useState } from "react";
import Page from './Page';
import { useParams  } from "react-router-dom";
import axios from "axios";
import StateContext from "../StateContext";
import ProfilePosts from './ProfilePosts';

function Profile() {
  // useParams returns object with many possible items so destructure it
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" }
  })

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    const postUrl = `/profile/${username}`;

    async function fetchData() {
      try {
        const response = await axios.post(postUrl, {token: appState.user.token}, {cancelToken: ourRequest.token});
        setProfileData(response.data);
      } catch (err) {
        console.log("There was a problem")
      }
    }
    fetchData();
     //Cleaning up: to prevent memory leaks run return when componment is unmounted(cancel fetch)
    return () => {
      ourRequest.cancel();
    }
  }, [appState.loggedIn])

  return (
    <Page title="Profile Screen">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} /> {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.followingCount}
        </a>
      </div>

     <ProfilePosts/>
     
    </Page>
  )
}

export default Profile;