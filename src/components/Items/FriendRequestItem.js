import React from "react";

const FriendRequestItem = ({request, accept, deny, sent=false}) => {
    
    return (
        <div className="friend-item">
            {sent ? 
            <div className="user-info">
                <h2>{request.recipient.displayname}</h2>
                <p>{request.recipient.username}</p>
            </div>
            :
            <div className="user-info">
                <h2>{request.initiator.displayname}</h2>
                <p>{request.initiator.username}</p>
            </div>
            }
            
            {sent ?
                <div className="friend-request-buttons">
                    <button className="red" value={request._id} onClick={deny}>Cancel</button>
                    <button className="gray" value={request._id} disabled>Pending</button>
                </div>
                :
                <div className="friend-request-buttons">
                    <button className="red" value={request._id} onClick={deny}>Deny</button>
                    <button className="green" value={request._id} onClick={accept}>Accept</button>
                </div>
            }
        </div>
    )
}
export default FriendRequestItem