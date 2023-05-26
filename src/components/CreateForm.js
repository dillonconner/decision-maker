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

/*
const testPosition = {
    lat: 37.090493,
    lng: -76.437918
};
const testFriends = [
    {user_id: 'testuser', displayname: 'Dillon Conner'},
    {user_id: 'testuser1', displayname: 'dillon1'},
    {user_id: 'testuser2', displayname: 'dillon2'},
    {user_id: 'testuser3', displayname: 'dillon3'},
    {user_id: 'testuser4', displayname: 'dillon4'},
    {user_id: 'testuser5', displayname: 'dillon5'},
    {user_id: 'testuser5', displayname: 'dillon5'},
    {user_id: 'testuser5', displayname: 'dillon5'},
    {user_id: 'testuser5', displayname: 'dillon5'},
    {user_id: 'testuser5', displayname: 'dillon5'},
    {user_id: 'testuser5', displayname: 'dillon5'},
    {user_id: 'testuser5', displayname: 'dillon5'},
    {user_id: 'testuser5', displayname: 'dillon5'},
    {user_id: 'testuser5', displayname: 'dillon5'},
    {user_id: 'testuser5', displayname: 'dillon5'},
    {user_id: 'testuser5', displayname: 'dillon5'},
    {user_id: 'testuser5', displayname: 'dillon5'}
]
/*  sample request
initiator: 'Test1',
recipients: [{user: 'test1', voted: true}, {user: 'test2', voted: false}, {user: 'test3', voted: true}],
subject: 'Lunch',
time: 'Noon',
center: { lat: 37.090493, lng: -76.437918 },
placeVotes: [],
round: 1,
winner: "Pending.."
*/
const CreateForm = () => {

    const auth = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const center = useSelector(selectCenter);
    const radius = useSelector(selectRadius);
    const places = useSelector(selectPlaces);
    const [ currRequest, setCurrRequest ] = useState({
        initiator: auth.user.user_id,
        subject: '', 
        time: '',
        recipients: [auth.user.user_id]
    })
    const [added, setAdded] = useState ([]);

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
        if(window.confirm('You\'re about to do a nearby search, which costs money')){
            dispatch(searchNearby(request));
        }
    };
    const addFriend = (e) => {
        const newRecipients = [...currRequest.recipients, e.target.value];
        setCurrRequest({...currRequest, recipients: newRecipients});
        setAdded([...added, ])
    }
    const removeFriend = (e) => {
        const newRecipients = currRequest.recipients.filter((r) => r !== e.target.value);
        setCurrRequest({...currRequest, recipients: newRecipients});
    }
    const handleSubjectChange = (e) => {setCurrRequest({...currRequest, subject: e.target.value})}
    const handleTimeChange = (e) => {setCurrRequest({...currRequest, time: e.target.value})}
    const handleCancel = (e) => {
        e.preventDefault();
        dispatch(resetMap());
        navigate('/');
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        //build request
        const request = {
            ...currRequest,
            recipients: currRequest.recipients.map(r => {return {user_id:r, voted:false}}),
            placeVotes: places.map(p => {return {place: p, votes: 0}}),
            center: center,
            round: 1,
        }
        console.log(request);
        //send request to backend
        await fetch(`${baseUrl}/decisions`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'authorization' : `Bearer ${localStorage.getItem('token')}`},
            body: JSON.stringify(request)
            }).then(async (response) => {
                //go to vote
                const resp = await response.json();
                console.log(resp);
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
                    <div className="form-options">
                        <div className="option">
                            <label htmlFor="subject">Subject:</label>
                            <input name="subject" placeholder="Subject" value={currRequest.subject} onChange={handleSubjectChange} />
                        </div>
                        <div className="option">
                            <label htmlFor="time">Time:</label>
                            <input name="time" type="time" placeholder="Time" value={currRequest.time} onChange={handleTimeChange}/>
                        </div>
                        
                        <button className="add-friends-btn" onClick={e=> setShowFriends(true)}>Add Friends</button>
                        <div className="submit-btns">
                            <button onClick={handleCancel}>Cancel</button>
                            <button onClick={handleSubmit}>Submit</button>
                        </div>
                        <div className="places-preview">
                            <div className="folder-header">
                                <p>Places Preview</p>
                                <p>{places.length}</p>
                            </div>
                            {places.map((p, id) => <p key={id}>{p.name}</p>)}
                        </div>
                    </div>
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
                                    add={addFriend} 
                                    remove={removeFriend} 
                                    added={currRequest.recipients.includes(f.user_id)} 
                                    />
                        })}
                    </div>
                </div>
                <button className="done-btn" onClick={e=> setShowFriends(false)}>Done</button>
            </div>
        }
    </div>
    )
}
export default CreateForm