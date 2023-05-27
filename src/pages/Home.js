import React from "react";

import ItemArea from "../components/ItemArea";
import { useNavigate } from "react-router-dom";

const testPosition = {
    lat: 37.090493,
    lng: -76.437918
};

const Home = () => {

    const navigate = useNavigate();

    const handleNavigate = (e) => {
        navigate('new-decision');
    }
    //<button onClick={handleSearchNearby}>Search Nearby</button>
    return (
        <div className="home">
            <button className="search-nearby" onClick={handleNavigate} >New Decision</button>
            <ItemArea />
        </div>
        
    )
}
export default Home