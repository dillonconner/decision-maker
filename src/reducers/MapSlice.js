import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../util/apiConfig';
// search nearby

export const searchNearby = createAsyncThunk(
    'map/searchNearby',
    async (request) => {
        console.log('search nearby');
        const resp = await fetch(`${baseUrl}/google/nearbysearch`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request)
        }).then(response => response.json());

        console.log(resp);
        return resp
    }
);

const initialState = {
    places: [],
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
            //console.log('pending');
            state.isLoading = true;
            state.requestFailed = false;
        },
        [searchNearby.fulfilled]: (state, action) => {
            //console.log('fulfilled');
            console.log(action.payload);
            state.isLoading = false;
            state.requestFailed = false;
            state.places = action.payload;
        },
        [searchNearby.rejected]: (state, action) => {
            //console.log('rejected');
            state.isLoading = false;
            state.requestFailed = true;
        },
    }
});

export const selectCenter = state => state.map.center;
export const selectBounds = state => state.map.bounds;
export const selectPlaces = state => state.map.places;
export const selectRadius = state => state.map.radius;
export const selectIsLoading = state => state.map.isLoading;

export const { updateBounds, updateCenter, updateRadius, updatePlaces, resetMap} = mapSlice.actions;

export default mapSlice.reducer;