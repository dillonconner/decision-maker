import React, { useCallback, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
    width: '50vw',
    height: '50vh'
  };
  
  const center = {
    lat: 37.375669,
    lng: -76.348368
  };

const Map = () => {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'legoogleapikey',
    })

    const [ map, setMap ] = useState(null);
   
    const onLoad = useCallback( (map) => {
        //const bounds = new window.google.maps.LatLngBounds(center);
        //map.fitBounds(bounds);
        //setMap(map);
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map.setCenter(pos);
                
                }, () => {
                //handle error
                }
            );
        } else {
            //handle location not allowed
        }
    }, [])

    const onUnmount = useCallback((map) => {
        setMap(null);
    }, [])


    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <Marker position={center} icon={'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'} />
            {/* Children: markers, windows */}
        </GoogleMap>
    ) : <></>
}
export default Map