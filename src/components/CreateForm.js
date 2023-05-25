import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { searchNearby } from "../reducers/MapSlice";
import minimizeIcon from '../icons/minimize.svg';
import { useNavigate } from "react-router-dom";
import FriendItem from "./Items/FriendItem";
import { useAuth } from "../hooks/use-auth";

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
    {user_id: 'testuser5', displayname: 'dillon5'},]
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
    const [ currRequest, setCurrRequest ] = useState({
        subject: '', 
        time: '',
        dist: 20000, 
        recipients: []
    })
    const [added, setAdded] = useState ([]);
    

    
    const addFriend = (e) => {
        const newRecipients = [...currRequest.recipients, e.target.value];
        setCurrRequest({...currRequest, recipients: newRecipients});
        setAdded([...added, ])
    }
    const removeFriend = (e) => {
        const newRecipients = currRequest.recipients.filter((r) => r !== e.target.value);
        setCurrRequest({...currRequest, recipients: newRecipients});
    }

    const handleSearchNearby = (e) => {
        const request = {
            center: testPosition,
            dist: "2500",
            type: "restaurant",
            keyword: "food"
        }
        dispatch(searchNearby(request));
    };
    const handleSubjectChange = (e) => {setCurrRequest({...currRequest, subject: e.target.value})}
    const handleDistChange = (e) => {setCurrRequest({...currRequest, dist: e.target.value})}
    const handleTimeChange = (e) => {setCurrRequest({...currRequest, time: e.target.value})}
    const handleCancel = (e) => {
        e.preventDefault();
        navigate('/');
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        //get places from map slice
        //build request
        //send request to backend
        //go to vote
    }

    const [ minimize, setMinimize ] = useState(false);
    const [ showFriends, setShowFriends ] = useState(false);
    
    return (
    <div className="create-form">
        <button className="search-nearby" onClick={handleSearchNearby}>Search Nearby</button>
        <div className={!minimize ? "item-area" : 'item-area minimized'}>
            <div className="minimize-wrapper " onClick={e => setMinimize(!minimize)}>
                <img className="minimize-icon" src={minimizeIcon} />
            </div>
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
                        <label htmlFor="dist">Distance:</label>
                        <input name="dist" type="number" placeholder="Distance" value={currRequest.dist} onChange={handleDistChange} />
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