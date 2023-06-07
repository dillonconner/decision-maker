import React, { useState } from "react";
import { useAuth } from "../hooks/use-auth";

const Profile = ({close}) => {

    const auth = useAuth();

    const handleLogout = (e) => {
        close();
        auth.logout();
    }

    return (
        <div className="profile popup">
            <h2 className="popup-header">Profile</h2>
            <p>Display name: {auth.user.displayname}</p>
            <p>Username: {auth.user.username}</p>
            <p>Friends: {auth.user.friends.length}</p>
            <div className="popup-btns">
                <button onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    )
}
export default Profile