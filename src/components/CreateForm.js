import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import minimizeIcon from '../icons/minimize.svg';
import { useAuth } from "../hooks/use-auth";
import {searchNearby, 
        selectCenter, 
        selectRadius, 
        selectPlaces, 
        updateBounds, 
        resetMap } from "../reducers/MapSlice";
import { setFull } from "../reducers/DRequestSlice";
import FriendItem from "./Items/FriendItem";
import { findNewBounds } from "../util/distCalc";
import { baseUrl } from "../util/apiConfig";

const CreateForm = () => {

    const auth = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const center = useSelector(selectCenter);
    const radius = useSelector(selectRadius);
    const places = useSelector(selectPlaces);
    const [ currRequest, setCurrRequest ] = useState({
        initiator: {user_id: auth.user.user_id, displayname: auth.user.displayname},
        subject: '', 
        time: '',
        recipients: [{user_id: auth.user.user_id, displayname: auth.user.displayname}]
    })

    useEffect(() => {
        if(places.length > 0){
            const newBounds = findNewBounds(places);
            dispatch(updateBounds(newBounds));
        }
    }, [places])

    const handleSearchNearby = (e) => {
        const request = {
            center: center,
            dist: radius,
            type: "restaurant",
            keyword: "food"
        }
        //if(window.confirm('You\'re about to do a nearby search, which costs money')){
            dispatch(searchNearby(request));
        //}
    };
    const handleShowFriends = (e) => {
        e.preventDefault();
        setShowFriends(true);
    }
    const addFriend = (e) => {
        const targetUser = auth.user.friends.find(elem => elem.user_id === e.target.value);
        const newRecipients = [...currRequest.recipients, targetUser];
        setCurrRequest({...currRequest, recipients: newRecipients});
    }
    const removeFriend = (e) => {
        const newRecipients = currRequest.recipients.filter((r) => r.user_id !== e.target.value);
        setCurrRequest({...currRequest, recipients: newRecipients});
    }
    const handleSubjectChange = (e) => {
        const newSubject = e.target.value.length > e.target.maxLength ? e.target.value.slice(0, e.target.maxLength) : e.target.value; 
        setCurrRequest({...currRequest, subject: newSubject});
    }
    const handleTimeChange = (e) => {
        //const newTime = e.target.value < Date.now() ? Date.now() : e.target.value;
        const newTime = e.target.value;
        setCurrRequest({...currRequest, time: newTime});
    }
    const handleCancel = (e) => {
        e.preventDefault();
        dispatch(resetMap());
        navigate('/');
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const request = {
            ...currRequest,
            recipients: currRequest.recipients.map(r => {return {...r, voted:false}}),
            placeVotes: places.map(p => {return {place: p, votes: 0}}),
            center: center,
            round: 1,
        }
        await fetch(`${baseUrl}/decisions`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'authorization' : `Bearer ${localStorage.getItem('token')}`},
            body: JSON.stringify(request)
            }).then(async(response) => { //go to vote
                
                const resp = await response.json();
                dispatch(setFull(resp.data));
                navigate(`/vote/${resp.data._id}`);
        });
    }

    const [ minimize, setMinimize ] = useState(false);
    const [ showFriends, setShowFriends ] = useState(false);
    
    return (
    <div className="create-form">
        <button className="search-nearby" onClick={handleSearchNearby}>Search Here</button>
        <div className={!minimize ? "item-area" : 'item-area minimized'}>
            <div className="minimize-wrapper " onClick={e => setMinimize(!minimize)}>
                <img className="minimize-icon" src={minimizeIcon} />
            </div>
            <div className="options-container scrollable">
                <div className="item-section">
                    <div className="item-section-header">
                        <p>Options</p>
                        <p>People: {currRequest.recipients.length}</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                    <div className="form-options">
                        <div className="option">
                            <label htmlFor="subject">Subject:</label>
                            <input name="subject" 
                            placeholder="Subject" 
                            value={currRequest.subject} 
                            onChange={handleSubjectChange} 
                            required
                            maxLength={20}/>
                        </div>
                        <div className="option">
                            <label htmlFor="time">Time:</label>
                            <input name="time" 
                            type="datetime-local" 
                            placeholder="Time" 
                            value={currRequest.time} 
                            onChange={handleTimeChange} 
                            required />
                        </div>
                        
                        <button className="add-friends-btn" onClick={handleShowFriends}>Add Friends</button>
                        <div className="submit-btns">
                            <button onClick={handleCancel}>Cancel</button>
                            <button type='submit'>Submit</button>
                        </div>
                        <div className="places-preview">
                            <div className="folder-header">
                                <p>Places Preview</p>
                                <p>{places.length}</p>
                            </div>
                            {places.map((p, id) => <p key={id}>{p.name}</p>)}
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>

        {showFriends &&
            <div className="friends popup">
                <h2 className="popup-header">Add Friends</h2>
                <div className="friends-container">
                    <div className="scrollable">
                        {auth?.user.friends.map((f, id) => {
                            return <FriendItem key={id} 
                                    friend={f} 
                                    edit
                                    add={addFriend} 
                                    remove={removeFriend} 
                                    added={currRequest.recipients.find(r => r.user_id === f.user_id)} />
                        })}
                    </div>
                </div>
                <div className="popup-btns">
                    <button onClick={e=> setShowFriends(false)}>Done</button>
                </div>
            </div>
        }
    </div>
    )
}
export default CreateForm