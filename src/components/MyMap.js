import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleMap, Marker, Circle, useJsApiLoader } from "@react-google-maps/api";
import { selectPlaces, selectBounds, updateCenter, updateRadius  } from "../reducers/MapSlice";
import { findRadius } from "../util/distCalc";

const containerStyle = {
    width: 'var(--width)',
    height: '94vh',
    position: 'absolute',
    zIndex: '-1'
};
const defaultCenter = {
    lat: 36.156895,
    lng: -95.991549
};
//const libraries = ['places'];

const MyMap = () => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
        //libraries: libraries
    })
    const dispatch = useDispatch();
    
    const [ map, setMap ] = useState(null);
    const [ myPosition, setMyPosition ] = useState(null);
    const places = useSelector(selectPlaces);
    const bounds = useSelector(selectBounds);
    //development testing stuff
    const [ circleRadius, setCircleRadius ] = useState(null);
    const [ circleCenter, setCircleCenter ] = useState(null);
    

    useEffect(() => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setMyPosition(pos); //change this
                
                }, () => {
                //handle error
                }
            );
        } else {
            //handle location not allowed
        }
    }, []);
    
    useEffect(() => {
        if(bounds){
            map.fitBounds(bounds);
        }
    }, [bounds])

    
    const onLoad = (map) => {
        setMap(map);
        new window.google.maps.Marker({
            position: myPosition,
            map: map,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillOpacity: 1,
              strokeWeight: 2,
              fillColor: '#5384ED',
              strokeColor: '#ffffff',
            },
        });
    }
    const onIdle = () => {
        if(!map) return

        const newCenter = map.getCenter().toJSON();
        const newNE = map.getBounds().getNorthEast().toJSON()
        
        dispatch(updateCenter(newCenter));
        dispatch(updateRadius(findRadius(newCenter, newNE) * 1000 / 2));
    }
    
    return isLoaded ? (
        <div className="map">
            <GoogleMap 
                center={myPosition ? myPosition : defaultCenter}
                zoom={14}
                onLoad={onLoad}
                onIdle={onIdle}
                mapContainerStyle={containerStyle}
            >
                {circleCenter && circleRadius && <Circle center={circleCenter} radius={circleRadius} />}
                {places.length > 0 && 
                    places.map((p, id) => <Marker key={id} position={p.geometry.location} />)
                }
            </GoogleMap>
        </div>
    ) : <></>
}
export default MyMap