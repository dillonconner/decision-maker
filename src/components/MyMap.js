import React, { useCallback, useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleMap, Marker, Circle, useJsApiLoader } from "@react-google-maps/api";
import { selectPlaces, searchNearby } from "../reducers/MapSlice";

const containerStyle = {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    zIndex: '-1'
};
const testPosition = {
    lat: 37.090493,
    lng: -76.437918
};
const libraries = ['places'];

const MyMap = () => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
        libraries: libraries
    })
    const dispatch = useDispatch();
    

    const [ map, setMap ] = useState(null);
    const [ myPosition, setMyPosition ] = useState();
    const places = useSelector(selectPlaces);
    console.log('places in mymap');
    console.log(places);

    
    const onLoad = (map) => {
        console.log('map has loaded');
        setMap(map);
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setMyPosition(testPosition); //change this
                    map.setCenter(testPosition);
                
                }, () => {
                //handle error
                }
            );
        } else {
            //handle location not allowed
        }
    }
    
    return isLoaded ? (
        <div className="map">
            <GoogleMap 
                zoom={10}
                onLoad={onLoad}
                mapContainerStyle={containerStyle}
            >
                <Circle center={myPosition} radius={2500} />
                <Marker position={myPosition} />
                { places.length > 0 && 
                    places.map((p, id) => <Marker key={id} position={p.geometry.location} />)
                }
            </GoogleMap>
            
        </div>
    ) : <></>
}
export default MyMap