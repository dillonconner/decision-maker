import React from "react";
import votedCheck from '../../icons/voted-check.png';
import redX from '../../icons/red-x.png'

const FriendItem = ({friend, edit=false, add, remove, added, noIcon=false}) => {
    
    return edit ? (
        <div className="friend-item">
            <div className="user-info">
                <h2>{friend.displayname}</h2>
            </div>
            <div className="friend-request-buttons">
            {!added ?
                <button className="green" value={friend.user_id} onClick={add}>Add</button>
                :
                <button className="red" value={friend.user_id} onClick={remove}>Remove</button>
            }
            </div>
        </div>
    ) :
    (
        <div className="friend-item">
            {friend.voted && <img className="selected" src={votedCheck} alt="selected" />}
            <div className="user-info">
                <h2>{friend.displayname}</h2>
            </div>
        </div>
    )
}
export default FriendItem