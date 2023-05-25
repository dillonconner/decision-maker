import React, { useState } from "react";
import Friends from "./Friends";
import Profile from "./Profile";
import { useAuth } from "../hooks/use-auth";

const UtilBar = () => {

    const auth = useAuth();

    const [showFriendsPopup, setShowFriendsPopup] = useState(false);
    const [showProfilePopup, setShowProfilePopup] = useState(false);

    const handleFriendsToggle = (e) => {
        setShowFriendsPopup(!showFriendsPopup);
        setShowProfilePopup(false);
    }
    const handleProfileToggle = (e) => {
        setShowProfilePopup(!showProfilePopup);
        setShowFriendsPopup(false);
    }

    return (
        <div className="util-bar">
            <button className="util-btn" onClick={handleProfileToggle}>Profile</button>
            <button className="util-btn" onClick={handleFriendsToggle}>Friends</button>
            {showFriendsPopup && auth.user && <Friends /> }
            {showProfilePopup && auth.user && <Profile /> }
        </div>
    )
}
export default UtilBar