import React, { useEffect } from "react";
import PlaceItem from "./Items/PlaceItem";
import { useDispatch, useSelector } from "react-redux";
import { loadFull, selectFull } from "../reducers/DRequestSlice";
import { useParams } from "react-router-dom";
import { updatePlaces } from "../reducers/MapSlice";

const Vote = () => {

    const dispatch = useDispatch();
    const { decisionId } = useParams();
    const full = useSelector(selectFull);
    

    useEffect(() => {
        console.log('vote load');
        console.log(full);
        if(!full){
            console.log('load full');
            dispatch(loadFull({decisionId}));
        }
    }, [])

    const addVote = (e) => {

    }

    return (
        <div className="vote">
            <div className="places-container">
                {full.placeVotes.length > 0 &&
                    full.placeVotes.map((pv, id) => {
                        return <PlaceItem key={id} num={`${id+1}/${full.placeVotes.length}`}  place={pv.place} addVote={addVote} />
                    })
                }
            </div>
        </div>
    )
}
export default Vote