import React, { useState } from "react";
import minimizeIcon from '../../icons/minimize.svg';
import votedCheck from '../../icons/voted-check.png';
import beerIcon from '../../icons/beer-icon.png';
import wineIcon from '../../icons/wine-icon.svg';
import veggieIcon from '../../icons/veggie-icon.png';
import wheelchairIcon from '../../icons/wheelchair-icon.svg';
import starOn from '../../icons/star-on.png';
import starOff from '../../icons/star-off.png';

const priceEnum = {'0': 'Free', '1': 'Cheap','2': 'Moderate','3': 'Expensive','4': 'Very Expensive',}
const googlePhotoBase = 'https://maps.googleapis.com/maps/api/place/photo';

const PlaceItem = ({place, num, toggleVote, voted, full=false, result=false}) => {

    const getStars = (rating) => {
        const starsOn = (rating/5) * 100;
        return (
            <div className="rating">
                <p>{rating}</p>
                <div className="stars-outer" >
                    <img className="star" src={starOff} alt=""/>
                    <img className="star" src={starOff} alt=""/>
                    <img className="star" src={starOff} alt=""/>
                    <img className="star" src={starOff} alt=""/>
                    <img className="star" src={starOff} alt=""/>
                    <div className="stars-inner" style={{width: starsOn + '%'}}>
                        <img className="star" src={starOn} alt=""/>
                        <img className="star" src={starOn} alt=""/>
                        <img className="star" src={starOn} alt=""/>
                        <img className="star" src={starOn} alt=""/>
                        <img className="star" src={starOn} alt=""/>
                    </div>
                </div>
            </div>
        )
    }
    const getImgSrc = (ref, width=300) => {
        return `${googlePhotoBase}?maxwidth=${width}&photoreference=${ref}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`
    }
    const getClose = () => {
        const day = new Date();
        const currDay = day.getDay();
        const minPeriodDiff = Math.min(...place.current_opening_hours.periods.map((p) => {
            const diff = p.open.day - currDay;
            return (diff < 0) ? diff+7 : diff
        }));
        const period = place.current_opening_hours.periods.find((p) => {
            let diff = p.open.day - currDay;
            if(diff < 0) diff += 7;
            return diff === minPeriodDiff
        });
        
        let closeTime = period.close.time;
        
        let hours = closeTime.slice(0,2);
        if(hours == 0) return '12 AM';
        else if(hours == 12) return '12 PM';
        else if(hours > 12) return (hours-12) + ' PM';
        else return (hours-0) + ' AM';
    }
    const getOpen = () => {
        const day = new Date();
        const currDay = day.getDay();
        const minPeriodDiff = Math.min(...place.current_opening_hours.periods.map((p) => {
            const diff = p.open.day - currDay;
            return (diff < 0) ? diff+7 : diff
        }));
        const period = place.current_opening_hours.periods.find((p) => {
            let diff = p.open.day - currDay;
            if(diff < 0) diff += 7;
            return diff === minPeriodDiff
        });
        
        let openTime = period.open.time;
        let hours = openTime.slice(0,2);
        if(hours == 0) return '12 AM';
        else if(hours == 12) return '12 PM';
        else if(hours > 12) return (hours-12) + ' PM';
        else return (hours-0) + ' AM';
    }
    const handleVote = (e) => {
        if(toggleVote){
            toggleVote(e, place.place_id, place.name);
        }
        
    }
    
    const [ showFull, setShowFull ] = useState(full);
    return (
        <div className={showFull ? result ? 'place-item result' : 'place-item full' : 'place-item'}>
            {!full && <div className="minimize-wrapper " onClick={e => setShowFull(!showFull)}>
                <img className="minimize-icon" src={minimizeIcon} alt="minimize"/>
                <p className="place-num">{num}</p>
                {voted && <img className="voted-check" src={votedCheck}  alt="voted" />}
            </div>}
            <div className={showFull ? result ? 'place-container result': 'place-container scrollable' : 'place-container'} onClick={handleVote}>
                <div className="place-header">
                    <h2>{place.name}</h2>
                </div> 
                {place.photos && <img className="header-img" src={getImgSrc(place.photos[0].photo_reference)} alt='place' />}
                <div className="place-details">
                    <div className="row">
                        {place.rating && getStars(place.rating)}
                        {place.user_ratings_total && <p className="total-ratings">{'(' + place.user_ratings_total + ')'}</p>}
                    </div>
                    <div className="row">
                        {place.price_level ? <p>Price: {priceEnum[place.price_level.toString()]}</p> : <p>Price: ???</p>}
                    </div>
                    <div className="row">
                        <p className={place.dine_in ? 'green' : 'red'}>Dine in</p>
                        <p className="dot">.</p>
                        <p className={place.takeout ? 'green' : 'red'}>Carry out</p>
                        <p className="dot">.</p>
                        <p className={place.delivery ? 'green' : 'red'}>Delivery</p>
                    </div>
                    {'opening_hours' in place  ?
                        place.opening_hours.open_now ? 
                        <div className="row">
                            <p className="green">Open</p>
                            <p className="dot">.</p>
                            <p>Closes {getClose()}</p>
                        </div>
                        :
                        <div className="row">
                            <p className="red">Closed</p>
                            <p className="dot">.</p>
                            <p>Opens {getOpen()}</p>
                        </div>
                        :
                        <div></div>
                    }
                    {!result &&
                        <div className="row links">
                            <a target="_blank" href={place.website}>Website</a>
                            <a target="_blank" href={place.url}>Directions</a>
                        </div>
                    }
                    {showFull &&
                    <div className="place-extra">
                        <div className="place-section">
                            <div className="place-section-header">
                                <h4>Info</h4>
                            </div>
                            {place.formatted_address && <p>Address: {place.formatted_address}</p>}
                            {place.formatted_phone_number && <p>Phone: {place.formatted_phone_number}</p>}
                            <div className="row">
                                {place.serves_beer && <img className="icon large" src={beerIcon} alt="serves beer"/>}
                                {place.serves_wine && <img className="icon large" src={wineIcon} alt="serves wine"/>}
                                {place.serves_vegetarian_food && <img className="icon large" src={veggieIcon} alt="vegitarian items"/>}
                                {place.wheelchair_accessible_entrance && <img className="icon large" src={wheelchairIcon} alt="wheelchair accessible"/>}
                            </div>
                            <div className="row">
                                <p>Serves: </p>
                                {place.serves_breakfast && <p>Breakfast <span className="dot">.</span></p>}
                                {place.serves_brunch && <p>Brunch <span className="dot">.</span></p>}
                                {place.serves_lunch && <p>Lunch <span className="dot">.</span></p>}
                                {place.serves_dinner && <p>Dinner <span className="dot">.</span></p>}
                            </div>
                        </div>
                        <div className="place-section">
                            <div className="place-section-header">
                                <h4>Photos</h4>
                            </div>
                            <div className="image-gallery">
                            {place.photos?.map(((img, id) => {
                                if(id > 0) return <img key={id} className="gallery-img" src={getImgSrc(img.photo_reference, 200)} alt='image' /> }))
                            }
                            </div>
                        </div>
                        <div className="place-section">
                            <div className="place-section-header">
                                <h4>Reviews</h4>
                            </div>
                            <p style={{fontStyle: 'italic'}}>Reviews not implemented yet</p>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}
export default PlaceItem