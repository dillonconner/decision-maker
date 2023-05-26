import React, { useState, useEffect } from "react";

import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from "../hooks/use-auth";
import FriendItem from "./Items/FriendItem";
import loadingIcon from '../icons/Loading-icon.gif';
import openIcon from '../icons/open-arrow.png';
import closedIcon from '../icons/closed-arrow.png';

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

const Friends = () => {

    const auth = useAuth();
    //console.log(auth.user);

    const [ searchTerm, setSearchTerm ] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 1000);
    const [ searchLoading, setSearchLoading ] = useState(true);

    useEffect(() => {
        //request friend search
        setSearchLoading(false);
    }, [debouncedSearch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        setSearchLoading(true);
    };

    const addFriend = (e) => {

    }
    const removeFriend = (e) => {

    }

    const [ minimizeFSearch, setMinimizeFSearch ] = useState(true);
    const [ minimizeFArea, setMinimizeFArea ] = useState(false);
    return (
        <div className="friends popup">
            <h2 className="popup-header">Friends</h2>
            <div className="friends-container scrollable">
                <div className={minimizeFSearch ? 'friends-search minimized' : "friends-search"}>
                    <div className="folder-header" onClick={e=> setMinimizeFSearch(!minimizeFSearch)}>
                        <p>Add Friends</p>
                        <img className="icon" src={minimizeFSearch ? closedIcon : openIcon} />
                    </div>
                    <div className="folder-area">
                        <input className="searchbar" 
                            type="text" 
                            value={searchTerm} 
                            placeholder="Search by username" 
                            onChange={handleSearchChange}
                        />
                        {searchLoading && <img className="loading-img" src={loadingIcon} alt={null} />}
                        {testFriends.map((f, id) => <FriendItem key={id} friend={f} add={addFriend} added={false} />)}
                    </div>
                    

                </div>
                <div className={minimizeFArea ? 'friends-area minimized' : "friends-area"}>
                    <div className="folder-header" onClick={e=> setMinimizeFArea(!minimizeFArea)}>
                        <p>Friends</p>
                        <img className="icon" src={minimizeFArea ? closedIcon : openIcon} />
                    </div>
                    {testFriends.length > 0 ?  
                        testFriends.map((f, id) => {
                            return <FriendItem key={id} friend={f} remove={removeFriend} added={true} noIcon />
                        })
                        :
                        <p>You have no friends</p>
                    }
                </div>
            </div>
        </div>
    )
}
export default Friends