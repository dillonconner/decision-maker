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
    const closePopups = () => {
        setShowProfilePopup(false);
        setShowFriendsPopup(false);
    }

    return (
        <div className="util-bar">
            <button className="util-btn" onClick={handleProfileToggle}>Profile</button>
            <button className="util-btn" onClick={handleFriendsToggle}>Friends</button>
            {showFriendsPopup && auth.user && <Friends close={closePopups}/> }
            {showProfilePopup && auth.user && <Profile close={closePopups}/> }
        </div>
    )
}
export default UtilBar