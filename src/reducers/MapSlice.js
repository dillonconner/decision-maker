import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// search nearby

export const searchNearby = createAsyncThunk(
    'map/searchNearby',
    async (request) => {
        console.log('search nearby');
        const resp = await fetch('http://localhost:8080/google/nearbysearch',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request)
        }).then(response => response.json());

        console.log(resp);
        return resp
    }
);


/* place details
lat: 37.375669,
    lng: -76.348368
    https://maps.googleapis.com/maps/api/place/nearbysearch/json
    ?keyword=food
    &location=-33.8670522%2C151.1957362
    &radius=1500
    &key=AIzaSyB4mCmVtOxLYzgDXylCg_6xHpP3ALrio0k
// directions ??
*/
const mapSlice = createSlice({
    name: 'map',
    initialState: {
        places: [],
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    extraReducers: {
        [searchNearby.pending]: (state, action) => {
            console.log('pending');
            state.isLoading = true;
            state.requestFailed = false;
        },
        [searchNearby.fulfilled]: (state, action) => {
            console.log('fulfilled');
            console.log(action.payload);
            state.isLoading = false;
            state.requestFailed = false;
            state.places = action.payload;
        },
        [searchNearby.rejected]: (state, action) => {
            console.log('rejected');
            state.isLoading = false;
            state.requestFailed = true;
        },
    }
});

export const selectCenter = state => state.map.center;
export const selectPlaces = state => state.map.places;
export const selectIsLoading = state => state.map.isLoading;
export default mapSlice.reducer;