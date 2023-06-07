import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../util/apiConfig';


const initialState = {
    sent: [],
    recieved: [],
    isLoading: false,
    hasError: false
};

const fRequestSlice = createSlice({
    name: 'fRequest',
    initialState: initialState,
    reducers: {},
    extraReducers: {

    }
});

export const selectSent = state => state.fRequest.sent;
export const selectRecieved = state => state.fRequest.recieved;
export const selectIsLoading = state => state.fRequest.isLoading;

export default fRequestSlice.reducer;