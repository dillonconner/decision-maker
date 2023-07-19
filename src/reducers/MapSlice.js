import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../util/apiConfig';
// search nearby

export const searchNearby = createAsyncThunk(
    'map/searchNearby',
    async (request) => {
        const resp = await fetch(`${baseUrl}/google/nearbysearch`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request)
        }).then(response => response.json());
        return resp
    }
);
export const loadPlaceDetails = createAsyncThunk(
    'map/loadPlaceDetails',
    async (places) => {
        const placesArr = [];
        for(const place of places){
            const resp = await fetch(`${baseUrl}/google/placedetails`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({place_id: place.place_id})
            }).then(response => response.json());
            placesArr.push(resp);
        }
        //console.log(placesArr);
        return placesArr
    }
)
export const loadResultDetails = createAsyncThunk(
    'map/loadResultDetails',
    async ({place_id}) => {
        const resp = await fetch(`${baseUrl}/google/placedetails`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({place_id:place_id})
        }).then(response => response.json());
        return resp
    }
)

const initialState = {
    places: [],
    placesDetails: [],
    resultDetails: null,
    center: null,
    bounds: null,
    radius: null,
    isLoading: false,
    hasError: false,
}

const mapSlice = createSlice({
    name: 'map',
    initialState: initialState,
    reducers: {
        updateCenter(state, action) {
            state.center = action.payload;
        },
        updateBounds(state, action) {
            state.bounds = action.payload;
        },
        updateRadius(state, action) {
            state.radius = action.payload;
        },
        updatePlaces(state, action) {
            state.places = action.payload;
        },
        resetMap(state) {
            state = initialState;
        }
    },
    extraReducers: {
        [searchNearby.pending]: (state, action) => {
            state.isLoading = true;
            state.requestFailed = false;
        },
        [searchNearby.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = false;
            state.places = action.payload;
        },
        [searchNearby.rejected]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = true;
        },
        [loadPlaceDetails.pending]: (state, action) => {
            state.isLoading = true;
            state.requestFailed = false;
        },
        [loadPlaceDetails.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = false;
            state.placesDetails = action.payload;
        },
        [loadPlaceDetails.rejected]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = true;
        },
        [loadResultDetails.pending]: (state, action) => {
            state.isLoading = true;
            state.requestFailed = false;
        },
        [loadResultDetails.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = false;
            state.resultDetails = action.payload;
        },
        [loadResultDetails.rejected]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = true;
        },
    }
});
export const selectPlaces = state => state.map.places;
export const selectPlaceDetails = state => state.map.placesDetails;
export const selectResultDetails = state => state.map.resultDetails;
export const selectCenter = state => state.map.center;
export const selectBounds = state => state.map.bounds;
export const selectRadius = state => state.map.radius;
export const selectIsLoading = state => state.map.isLoading;

export const { updateBounds, updateCenter, updateRadius, updatePlaces, resetMap} = mapSlice.actions;

export default mapSlice.reducer;