import React, {useState, useEffect} from "react";
import PlaceItem from "./Items/PlaceItem";
import { useDispatch, useSelector } from "react-redux";
import { selectResultDetails, loadResultDetails } from "../reducers/MapSlice";
import FriendItem from "./Items/FriendItem";

const ShowResults = ({result, hideResults}) => {

    const dispatch = useDispatch();
    const resultDetails = useSelector(selectResultDetails);
    const [addressEncoded, setAddressEncoded] = useState(''); 
    
    useEffect(() => {
        dispatch(loadResultDetails({place_id: result.winner.place.place_id})); 
    }, []);

    useEffect(() => {
        if(resultDetails){
            let buildAddress = resultDetails.formatted_address;
            buildAddress = buildAddress.replaceAll(', ', '+');
            buildAddress = buildAddress.replaceAll(' ', '%20');
            setAddressEncoded(buildAddress);
        }
    }, [resultDetails]);
    
    
    return (
        <div className="show-results popup">
            <h2 className="popup-header">Results</h2>
            <div className="results-container scrollable">
                <h2>{result.subject}</h2>
                <p>{new Date(result.time).toLocaleString()}</p>
                <div className="item-section">
                    <div className="item-section-header">
                        <h3>Winner</h3>
                    </div>
                    {resultDetails && <PlaceItem place={resultDetails} full result/>}
                </div>
                <div className="item-section">
                    <div className="item-section-header">
                        <h3>People: </h3>
                        <p >{result.recipients.length}</p>
                    </div>
                    {result.recipients.map((r, id) => <FriendItem key={id} friend={r} />)}
                </div>
            </div>
            <div className="popup-btns">
                <a target="_blank" href={`https://www.google.com/maps?saddr=current+location&daddr=${addressEncoded}`}>Get Directions</a>
                <button onClick={hideResults}>Done</button>
            </div>
        </div>
    )
}
export default ShowResults