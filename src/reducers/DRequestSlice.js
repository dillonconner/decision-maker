import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../util/apiConfig';

export const loadPreviews = createAsyncThunk(
    'dRequest/loadPreviews',
    async () => {
        console.log('load Previews');
        const resp = await fetch(`${baseUrl}/decisions`, {
            method: 'GET',
            headers: {'authorization' : `Bearer ${localStorage.getItem('token')}` },
        });
        const json = await resp.json();
        return json.data;
    }
)
export const loadFull = createAsyncThunk(
    'dRequest/loadFull',
    async ({decisionId}) => {
        console.log('loadFull');
        const resp = await fetch(`${baseUrl}/decisions/${decisionId}`, {
            method: 'GET',
            headers: {'authorization' : `Bearer ${localStorage.getItem('token')}` }
        });
        const json = await resp.json();
        return json.data;
    }
)


const initialState = {
    previews: [],
    full: null,
    isLoading: false,
    hasError: false,
}

const dRequestSlice = createSlice({
    name: 'dRequest',
    initialState: initialState,
    reducers: { 
        setFull(state, action) {
            state.full = action.payload;
        }
    },
    extraReducers: {
        [loadPreviews.pending]: (state, action) => {
            state.isLoading = true;
            state.requestFailed = false;
        },
        [loadPreviews.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = false;
            state.previews = action.payload;
        },
        [loadPreviews.rejected]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = true;
        },
        [loadFull.pending]: (state, action) => {
            state.isLoading = true;
            state.requestFailed = false;
        },
        [loadFull.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = false;
            state.full = action.payload;
        },
        [loadFull.rejected]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = true;
        }
    }
});

export const selectFull = state => state.dRequest.full;
export const selectPreviews = state => state.dRequest.previews;
export const selectIsLoading = state => state.dRequest.isLoading;
export const { setFull } = dRequestSlice.actions;

export default dRequestSlice.reducer;