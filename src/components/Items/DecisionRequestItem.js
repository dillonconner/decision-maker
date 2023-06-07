import React, { useState } from "react";

import FriendItem from "./FriendItem";
import votedCheck from '../../icons/voted-check.png';
import redX from '../../icons/red-x.png'
import { useAuth } from "../../hooks/use-auth";
import { baseUrl } from "../../util/apiConfig";

const DecisionRequestItem = ({request, completed, result=false, onClick, deleteItem, force}) => {
    
    const auth = useAuth();
    const voted = request.recipients.filter(element =>  element.voted);
    const dispTime = new Date(request.time).toLocaleString();

    const handleForce = (e) => {
        setVotedPopup(false);
        force(e, request);
    }

    const [ votedPopup, setVotedPopup ] = useState(false);
    return (
        <div className="decision-request-item">
            <div className="item-header">
                <div onClick={e => onClick(e,request)}>
                    <h3>{request.subject} </h3>
                    <h6>{dispTime}</h6>
                </div>
                {completed && <img className="voted-check" src={votedCheck}  alt="voted" />}
                {!result && <img className="delete-icon" src={redX} onClick={e => deleteItem(e, request)} alt="remove"/> }
            </div>
            <div className="item-info">
                <p>From: {request.initiator.displayname}</p>
                <p style={{'textDecoration': 'underline'}} onClick={e => setVotedPopup(true)}>Voted: {voted.length}/{request.recipients.length}</p>
            </div>
            
            {votedPopup &&
                <div className="friends popup">
                    <h2 className="popup-header">Participants</h2>
                    <div className="friends-container">
                        <div className="scrollable">
                            {request.recipients.map((f, id) => {
                                return <FriendItem key={id} friend={f} />
                            })}
                        </div>
                    </div>
                    <div className="popup-btns">
                        <button onClick={e => setVotedPopup(false)}>Done</button>
                        {!result && (request.initiator.user_id === auth.user.user_id) && 
                            <button onClick={handleForce}>Force Decision</button>
                        }
                    </div>
                </div>
            }
        </div>
    )
}
export default DecisionRequestItem
