import React, { useState } from "react";

import DecisionRequestItem from "./Items/DecisionRequestItem";
import minimizeIcon from '../icons/minimize.svg';

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


const ItemArea = () => {

    const [ minimize, setMinimize ] = useState(false);

    return (
        <div className={!minimize ? "item-area" : 'item-area minimized'}>
            <div className="minimize-wrapper " onClick={e => setMinimize(!minimize)}>
                <img className="minimize-icon" src={minimizeIcon} />
            </div>
            <div className="items-container">
                <div className="scrollable">
                    <div className="item-section">
                        <div className="item-section-header">
                            <p>Pending</p>
                            <p>0</p>
                        </div>
                        <DecisionRequestItem request={testDRequest} completed={false} />
                        <DecisionRequestItem request={testDRequest} completed={false} />
                        <DecisionRequestItem request={testDRequest} completed={false} />
                    </div>
                    <div className="item-section">
                        <div className="item-section-header">
                            <p>Complete</p>
                            <p>0</p>
                        </div>
                        <DecisionRequestItem request={testDRequest} completed={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ItemArea