import React from "react";

import votedCheck from '../../icons/voted-check.png';
import redX from '../../icons/red-x.png'

const DecisionRequestItem = ({request, completed, result, onClick, deleteItem}) => {
    
    const voted = request.recipients.filter(element =>  element.voted);
    //console.log(request);
    

    return (
        <div className="decision-request-item" onClick={e => onClick(e,request)}>
            <div className="item-header">
                <h3>{request.subject} at {request.time}</h3>
                
                
                {completed && <img className="voted-check" src={votedCheck}  alt="voted" />}
                {!result && <img className="delete-icon" src={redX} onClick={e => deleteItem(e, request)} /> }
            </div>
            <div className="item-info">
                <p>From: {request.initiator.display_name}</p>
                <p>Voted: {voted.length}/{request.recipients.length}</p>
            </div>
        </div>
    )
}
export default DecisionRequestItem
