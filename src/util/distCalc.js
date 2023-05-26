export const findRadius = (locA, locB) => {
    // I stole all this from the internet
    const lon1 = locA.lng * Math.PI / 180;
    const lon2 = locB.lng * Math.PI / 180;
    const lat1 = locA.lat * Math.PI / 180;
    const lat2 = locB.lat * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
             + Math.cos(lat1) * Math.cos(lat2)
             * Math.pow(Math.sin(dlon / 2),2);
           
    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return(c * r);
}

export const findNewBounds= (places) => {
    const maxLat = Math.max(...places.map(p => p.geometry.location.lat));
    const minLat = Math.min(...places.map(p => p.geometry.location.lat));
    const maxLng = Math.max(...places.map(p => p.geometry.location.lng));
    const minLng = Math.min(...places.map(p => p.geometry.location.lng));

    return {north: maxLat, east: maxLng, south:minLat, west:minLng}
}