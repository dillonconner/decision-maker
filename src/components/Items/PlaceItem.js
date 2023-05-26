import React, { useState } from "react";
import minimizeIcon from '../../icons/minimize.svg';
import votedCheck from '../../icons/voted-check.png';

const priceEnum = {'0': 'Free', '1': 'Cheap','2': 'Moderate','3': 'Expensive','4': 'Very Expensive',}

const PlaceItem = ({place, num, addVote}) => {

    const [ showFull, setShowFull ] = useState(false);
    return (
        <div className={showFull ? 'place-item full' : 'place-item'}>
            <div className="minimize-wrapper " onClick={e => setShowFull(!showFull)}>
                <img className="minimize-icon" src={minimizeIcon} />
                <p className="place-num">{num}</p>
                <img className="voted-check" src={votedCheck}  alt="voted" />
            </div>
            <div className="place-container">
                <div className="place-header">
                    <h2>{place.name}</h2>
                    
                </div> 
                <div className="place-details">
                    <div className="row">
                        {place.rating && <p className="rating">Rating: {place.rating}</p>}
                        {place.user_ratings_total && <p className="total-ratings">{'\(' + place.user_ratings_total + '\)'}</p>}
                        {place.price_level && <p>${priceEnum[place.price_level.toString()]}</p>}
                    </div>
                    <div className="row">
                        <p>Dine in</p>
                        <p>Carry out</p>
                        <p>Delivery</p>
                    </div>
                    
                    {place.opening_hours.open_now ? <p className="green">Open</p>:<p className="red">Closed</p>}
                </div>
            </div>
        </div>
    )
}
export default PlaceItem