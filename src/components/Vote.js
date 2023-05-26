import React, { useEffect, useState } from "react";
import PlaceItem from "./Items/PlaceItem";
import { useDispatch, useSelector } from "react-redux";
import { loadFull, selectFull } from "../reducers/DRequestSlice";
import { useParams } from "react-router-dom";
import { updatePlaces } from "../reducers/MapSlice";
import minimizeIcon from '../icons/minimize.svg';

const Vote = () => {

    const dispatch = useDispatch();
    const { decisionId } = useParams();
    const full = useSelector(selectFull);
    const [ votes, setVotes ] = useState([]);
    const [ nextRank, setNextRank ] = useState(1);
    

    useEffect(() => {
        console.log('vote load');
        console.log(full);
        if(!full){
            console.log('load full');
            dispatch(loadFull({decisionId}));
        }
    }, [])

    const toggleVote = (e, placeId, placeName) => {
        if(votes.find(v => v.placeId === placeId)){
            setVotes(votes.filter(v => v.placeId !== placeId));
        } else {
            setVotes([...votes, {placeId, placeName, rank: 420}]);
        }
    }
    const toggleRank = (e, placeId) => {
        const vote = votes.find(v => v.placeId === placeId);
        if(vote.rank < 420){  //remove rank
            const newVote = {...vote, rank: 420};
            setVotes([...votes.filter(v => v.placeId !== placeId), newVote]);
            setNextRank(nextRank-1);
        }else { //add rank
            const newVote = {...vote, rank: nextRank};
            setVotes([...votes.filter(v => v.placeId !== placeId), newVote]);
            setNextRank(nextRank+1);
        }
        
    }
    const handleSubmit = (e) => {
        setShowRanking(false); //change
    }

    const [ showRanking, setShowRanking ] = useState(false);

    return !showRanking ? (
        <div className="vote">
            <button className="rank-btn" onClick={e => setShowRanking(true)}>Rank Picks</button>
            <div className="places-container">
                {full.placeVotes.length > 0 &&
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
                                        <p className="drag-num">{v.rank}st</p>
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