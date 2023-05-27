import React, { useState } from "react";
import { useAuth } from "../hooks/use-auth";

const Profile = () => {

    const auth = useAuth();

    return (
        <div className="profile popup">
            <h2 className="popup-header">Profile</h2>
            <p>Display name: {auth.user.displayname}</p>
            <p>Username: {auth.user.username}</p>
            <p>Friends: {auth.user.friends.length}</p>
            <button className="submit-btn" onClick={e => auth.logout() }>Log Out</button>
        </div>
    )
}
export default Profile