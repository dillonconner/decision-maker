import React, { useEffect, useState } from "react";

import DecisionRequestItem from "./Items/DecisionRequestItem";
import minimizeIcon from '../icons/minimize.svg';
import { useDispatch, useSelector } from "react-redux";
import { denyRequest, loadPreviews, selectPreviews } from "../reducers/DRequestSlice";
import { useAuth } from "../hooks/use-auth";
import { useNavigate } from "react-router-dom";
import ShowResults from "./ShowResults";
import { baseUrl } from "../util/apiConfig";

const ItemArea = () => {

    const auth = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const decisionPreviews = useSelector(selectPreviews);
    const [ pendingPreviews, setPendingPreviews ] = useState([]);
    const [ completePreviews, setCompletePreviews ] = useState([]);
    const [ resultsPopup, setResultsPopup ] = useState(null);

    useEffect(() => {
        dispatch(loadPreviews());
    }, [])

    useEffect(() => {
        setPendingPreviews(decisionPreviews.filter(d => !d.winner));
        setCompletePreviews(decisionPreviews.filter(d => d.winner));
    }, [decisionPreviews]);

    const goToVote = (e, request) => {
        if(!request.recipients.find(r => r.user_id === auth.user.user_id).voted){
            navigate(`/vote/${request._id}`);
        }
    }
    const showResults = (e, request) => {
        //show results popup
        setResultsPopup(request);
    }
    const deleteRequest = (e, request) => {
        if(e.stopPropagation) e.stopPropagation();
        if(auth.user.user_id === request.initiator.user_id){ //delete request
            //dispatch(deleteRequest(request._id));
            fetch(`${baseUrl}/decisions/${request._id}`, {
                method: 'DELETE',
                headers: {'authorization' : `Bearer ${localStorage.getItem('token')}` }
            }).then(() => dispatch(loadPreviews()))
        }else { //remove participation
            //dispatch(denyRequest(request._id));
            fetch(`${baseUrl}/decisions/decline/${request._id}`, {
                method: 'PUT',
                headers: {'authorization' : `Bearer ${localStorage.getItem('token')}` }
            }).then(() => dispatch(loadPreviews()))
        }
    }
    const force = (e, request) => {
        fetch(`${baseUrl}/decisions/forceDecision/${request._id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'authorization' : `Bearer ${localStorage.getItem('token')}`}
            }).then(() => dispatch(loadPreviews()))
    }

    const [ minimize, setMinimize ] = useState(false);
    return !auth.isLoading && (
        <div className={!minimize ? "item-area" : 'item-area minimized'}>
            <div className="minimize-wrapper " onClick={e => setMinimize(!minimize)}>
                <img className="minimize-icon" src={minimizeIcon} />
            </div>
            <div className="items-container">
                <div className="scrollable">
                    <div className="item-section">
                        <div className="item-section-header">
                            <p>Pending</p>
                            <p>{pendingPreviews.length}</p>
                        </div>
                        {pendingPreviews.length > 0 ?
                            pendingPreviews.map((p, id) =>{ 
                                return <DecisionRequestItem key={id} 
                                        request={p} 
                                        completed={p.recipients.find(r => r.user_id === auth.user.user_id).voted} 
                                        onClick={goToVote}
                                        deleteItem={deleteRequest}
                                        force={force}/>})
                            :
                            <p>No Pending Decisions</p>
                        }
                    </div>
                    <div className="item-section">
                        <div className="item-section-header">
                            <p>Complete</p>
                            <p>{completePreviews.length}</p>
                        </div>
                        {completePreviews.length > 0 ?
                            completePreviews.map((p, id) => {
                                return <DecisionRequestItem key={id} request={p} result onClick={showResults} deleteItem={deleteRequest}/>})
                            :
                            <p>No Completed Decisions</p>
                        }
                    </div>
                </div>
            </div>
            {resultsPopup && <ShowResults result={resultsPopup} hideResults={e => setResultsPopup(null)}/>}
        </div>
    )
}
export default ItemArea