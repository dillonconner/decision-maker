import React, { useState, useEffect } from "react";

import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from "../hooks/use-auth";
import FriendItem from "./Items/FriendItem";
import loadingIcon from '../icons/Loading-icon.gif';
import openIcon from '../icons/open-arrow.png';
import closedIcon from '../icons/closed-arrow.png';
import { baseUrl } from "../util/apiConfig";
import FriendRequestItem from "./Items/FriendRequestItem";

const Friends = ({close}) => {

    const auth = useAuth();

    const [ searchTerm, setSearchTerm ] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 1000);
    const [ searchLoading, setSearchLoading ] = useState(false);
    const [ searchUsers, setSearchUsers ] = useState([]);

    const [ sentRequests, setSentRequests] = useState([]);
    const [ recievedRequests, setRecievedRequests] = useState([]);

    useEffect(() => {
        loadFriendStuff();
    },[])

    useEffect(() => {
        if(searchTerm) {
            userSearch(debouncedSearch);
        } else {
            setSearchLoading(false);
            setSearchUsers([]);
        }

    }, [debouncedSearch]);

    const loadFriendStuff = () => {
        //load sent requests
        fetch(`${baseUrl}/friend/sent`, {
            method: "GET",
            headers: {'Content-Type': 'application/json', 'authorization' : `Bearer ${localStorage.getItem('token')}`}
        }).then(async (response) => {
            const resp = await response.json();
            setSentRequests(resp.data);
        });
        //load recieved requests
        fetch(`${baseUrl}/friend/recieved`, {
            method: "GET",
            headers: {'Content-Type': 'application/json', 'authorization' : `Bearer ${localStorage.getItem('token')}`}
        }).then(async (response) => {
            const resp = await response.json();
            setRecievedRequests(resp.data);
        });
        //reload friends with auth
        auth.autoLogin(localStorage.getItem('token'));
    }

    const userSearch = async (term) => {
        fetch(`${baseUrl}/friend/search`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'authorization' : `Bearer ${localStorage.getItem('token')}`},
            body: JSON.stringify({searchTerm: term}),
        }).then(async (response) => {
            const resp = await response.json();
            setSearchUsers(resp.data);
            setSearchLoading(false);
        })
    }
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setSearchLoading(true);
    };

    const addFriend = (e) => {
        const targetUser = searchUsers.find(elem => elem._id === e.target.value);
        fetch(`${baseUrl}/friend`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'authorization' : `Bearer ${localStorage.getItem('token')}`},
            body: JSON.stringify({
                initiator: {user_id: auth.user.user_id, username: auth.user.username, displayname:auth.user.displayname},
                recipient: {user_id: targetUser._id, username: targetUser.username, displayname:targetUser.displayname},
            })
        }).finally(() => {
            loadFriendStuff();
        });
        
    }
    const removeFriend = (e) => {
        const targetUser = auth.user.friends.find(elem => elem.user_id === e.target.value);
        fetch(`${baseUrl}/friend/remove`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'authorization' : `Bearer ${localStorage.getItem('token')}`},
            body: JSON.stringify({
                initiator: {user_id: auth.user.user_id, username: auth.user.username, displayname:auth.user.displayname},
                recipient: targetUser,
            })
        }).finally(() => {
            loadFriendStuff();
        });
    }
    const acceptFriend = (e) => {
        fetch(`${baseUrl}/friend/${e.target.value}`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json', 'authorization' : `Bearer ${localStorage.getItem('token')}`},
        }).finally(() => {
            loadFriendStuff();
        });
    }
    const cancelFriend = (e) => {
        fetch(`${baseUrl}/friend/${e.target.value}`, {
            method: "DELETE",
            headers: {'Content-Type': 'application/json', 'authorization' : `Bearer ${localStorage.getItem('token')}`},
        }).finally(() => {
            loadFriendStuff();
        });
    }
    
    const [ minimizeFSearch, setMinimizeFSearch ] = useState(true);
    const [ minimizeFArea, setMinimizeFArea ] = useState(true);
    const [ minimizeFPending, setMinimizeFPending ] = useState(false);
    return (
        <div className="friends popup">
            <h2 className="popup-header">Friends</h2>
            <div className="friends-container scrollable">
                <div className={minimizeFSearch ? 'friends-search minimized' : "friends-search"}>
                    <div className="folder-header" onClick={e=> setMinimizeFSearch(!minimizeFSearch)}>
                        <p>Add Friends</p>
                        <img className="icon" src={minimizeFSearch ? closedIcon : openIcon} alt="folder"/>
                    </div>
                    <div className="folder-area">
                        <input className="searchbar" 
                            type="text" 
                            value={searchTerm} 
                            placeholder="Search by username" 
                            onChange={handleSearchChange}
                        />
                        {searchLoading && <img className="loading-img" src={loadingIcon} alt={null} />}
                        {searchUsers.length > 0 ?
                            searchUsers.map((f, id) => {
                                if(!auth.user.friends.find(af => af.user_id === f._id) && auth.user.user_id !== f._id){
                                    return <FriendItem key={id} friend={{...f, user_id:f._id}} edit add={addFriend} added={false} />
                                }
                            })
                            :
                            searchTerm && <p>No Users Found</p>
                        }
                    </div>
                </div>
                <div className={minimizeFPending ? 'friends-pending minimized' : "friends-pending"}>
                    <div className="folder-header" onClick={e=> setMinimizeFPending(!minimizeFPending)}>
                        <p>Pending</p>
                        <img className="icon" src={minimizeFPending ? closedIcon : openIcon} alt="folder"/>
                    </div>
                    {recievedRequests.length > 0 &&  
                        recievedRequests.map((r, id) => {
                            return <FriendRequestItem key={id} request={r} accept={acceptFriend} deny={cancelFriend} />
                        })
                    }
                    {sentRequests.length > 0 &&  
                        sentRequests.map((r, id) => {
                            return <FriendRequestItem key={id} request={r} deny={cancelFriend} sent />
                        })
                    }
                </div>
                <div className={minimizeFArea ? 'friends-area minimized' : "friends-area"}>
                    <div className="folder-header" onClick={e=> setMinimizeFArea(!minimizeFArea)}>
                        <p>Friends</p>
                        <img className="icon" src={minimizeFArea ? closedIcon : openIcon} alt="folder"/>
                    </div>
                    {auth.user.friends.length > 0 ?  
                        auth.user.friends.map((f, id) => {
                            return <FriendItem key={id} friend={f} edit remove={removeFriend} added={true} noIcon />
                        })
                        :
                        <p>You have no friends</p>
                    }
                </div>
            </div>
            <div className="popup-btns">
                <button onClick={e => close()}>Done</button>
            </div>
        </div>
    )
}
export default Friends