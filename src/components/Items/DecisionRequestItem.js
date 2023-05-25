import React from "react";

import votedCheck from '../../icons/voted-check.png';

const testDRequest = {
    initiator: 'Test1',
    recipients: [{user: 'test1', voted: true}, {user: 'test2', voted: false}, {user: 'test3', voted: true}],
    subject: 'Lunch',
    time: 'Noon',
    center: { lat: 37.090493, lng: -76.437918 },
    placeVotes: [],
    round: 1,
    winner: "Pending.."
}

const DecisionRequestItem = ({request, completed}) => {

    
    const voted = request.recipients.filter(element =>  element.voted);

    return (
        <div className="decision-request-item">
            <div className="item-header">
                <h3>{request.initiator}</h3>
                <p>{request.subject}</p>
                <img className="voted-check" src={votedCheck}  alt="voted" />
            </div>
            <div className="item-info">
                <p>Time: {request.time}</p>
                <p>Voted: {voted.length}/{request.recipients.length}</p>
            </div>
        </div>
    )
}
export default DecisionRequestItem
