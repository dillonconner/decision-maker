import React from "react";
import votedCheck from '../../icons/voted-check.png';

const testFriend = {
    username: 'testuser1',
    displayname: 'Dillon Conner'
}

const FriendItem = ({friend, add, remove, added, noIcon=false}) => {

    return (
        <div className="friend-item">
            {added && !noIcon && <img className="selected" src={votedCheck} alt="selected" />}
            <h2>{friend.displayname}</h2>
            
            {!added ?
                <button value={friend.user_id} onClick={add}>Add</button>
                :
                <button value={friend.user_id} onClick={remove}>Remove</button>
            }
        </div>
    )
}
export default FriendItem