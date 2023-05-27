import React, { useEffect, useState } from "react";
import PlaceItem from "./Items/PlaceItem";
import { useDispatch, useSelector } from "react-redux";
import { clearFull, loadFull, selectFull } from "../reducers/DRequestSlice";
import { useNavigate, useParams } from "react-router-dom";
import { updatePlaces } from "../reducers/MapSlice";
import minimizeIcon from '../icons/minimize.svg';
import { baseUrl } from "../util/apiConfig";

const Vote = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { decisionId } = useParams();
    const full = useSelector(selectFull);
    const [ votes, setVotes ] = useState([]);
    const [ nextRank, setNextRank ] = useState(1);
    

    useEffect(() => {
        if(!full) dispatch(loadFull({decisionId})); 
    }, [])

    const toggleVote = (e, placeId, placeName) => {
        if(votes.find(v => v.placeId === placeId)){
            setVotes(votes.filter(v => v.placeId !== placeId));
        } else {
            setVotes([...votes, {placeId, placeName, rank: -Infinity}]);
        }
    }
    const toggleRank = (e, placeId) => {
        const vote = votes.find(v => v.placeId === placeId);
        if(vote.rank >= 0){  //remove rank
            const newVote = {...vote, rank: -Infinity};
            setVotes([...votes.filter(v => v.placeId !== placeId), newVote]);
            setNextRank(nextRank-1);
        }else { //add rank
            const newVote = {...vote, rank: nextRank};
            setVotes([...votes.filter(v => v.placeId !== placeId), newVote]);
            setNextRank(nextRank+1);
        }
        
    }
    const handleSubmit = async (e) => {
        //send votes
        setShowRanking(false); //change
        await fetch(`${baseUrl}/decisions/vote/${decisionId}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'authorization' : `Bearer ${localStorage.getItem('token')}`},
            body: JSON.stringify(votes)
            }).then(async (response) => { //go to vote
                
                const resp = await response.json();
                dispatch(clearFull());
                navigate(`/`);
        });
    }

    const [ showRanking, setShowRanking ] = useState(false);

    return !showRanking ? (
        <div className="vote">
            <button className="rank-btn" onClick={e => setShowRanking(true)}>Rank Picks</button>
            <div className="places-container">
                {full && full.placeVotes.length > 0 &&
                    full.placeVotes.map((pv, id) => {
                        return <PlaceItem key={id} 
                                num={`${id+1}/${full.placeVotes.length}`}  
                                place={pv.place} 
                                toggleVote={toggleVote}
                                voted={votes.find(v => v.placeId === pv.place.place_id)} />
                    })
                }
            </div>
        </div>
    )
    :
    (
        <div className="vote-ranking popup">
            <h2 className="popup-header">Rank Picks</h2>
            <div className="ranking-container scrollable">
                {
                    votes.sort((a,b) => a.rank-b.rank).map((v, id) => {
                        return <div className={"rank-item"} key={id} onClick={e => toggleRank(e, v.placeId)}>
                                    {v.rank > 0 && v.rank < 419 ? 
                                        <p className="drag-num">{v.rank}{v.rank>3 ? 'th' : v.rank>2 ? 'rd' : v.rank>1 ? 'nd' : 'st'}</p>
                                        :
                                        <p className="drag-num unranked">unranked</p>
                                    }
                                    <p className="drag-place">{v.placeName}</p>
                                    <img className="drag-icon" src={minimizeIcon} alt='draggable'/>
                                </div>
                    })
                }
            </div>
            <button className="submit-btn" onClick={handleSubmit}>Submit Vote</button>
        </div>
    )
}
export default Vote