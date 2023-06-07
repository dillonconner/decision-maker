import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../util/apiConfig';

export const loadPreviews = createAsyncThunk(
    'dRequest/loadPreviews',
    async () => {
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
        const resp = await fetch(`${baseUrl}/decisions/${decisionId}`, {
            method: 'GET',
            headers: {'authorization' : `Bearer ${localStorage.getItem('token')}` }
        });
        const json = await resp.json();
        return json.data;
    }
)
export const denyRequest = createAsyncThunk(
    'dRequest/denyRequest',
    async ({decisionId}) => {
        const resp = await fetch(`${baseUrl}/decisions/decline/${decisionId}`, {
            method: 'PUT',
            headers: {'authorization' : `Bearer ${localStorage.getItem('token')}` }
        });
        const json = await resp.json();
        return json.data;
    }
)
export const deleteRequest = createAsyncThunk(
    'dRequest/deleteRequest',
    async ({decisionId}) => {
        const resp = await fetch(`${baseUrl}/decisions/${decisionId}`, {
            method: 'DELETE',
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
};

const dRequestSlice = createSlice({
    name: 'dRequest',
    initialState: initialState,
    reducers: { 
        setFull(state, action) {
            state.full = action.payload;
        },
        clearFull(state) {
            state.full = null;
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
        },
        [denyRequest.pending]: (state, action) => {
            state.isLoading = true;
            state.requestFailed = false;
        },
        [denyRequest.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = false;
        },
        [denyRequest.rejected]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = true;
        },
        [deleteRequest.pending]: (state, action) => {
            state.isLoading = true;
            state.requestFailed = false;
        },
        [deleteRequest.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = false;
        },
        [deleteRequest.rejected]: (state, action) => {
            state.isLoading = false;
            state.requestFailed = true;
        },
    }
});

export const selectFull = state => state.dRequest.full;
export const selectPreviews = state => state.dRequest.previews;
export const selectIsLoading = state => state.dRequest.isLoading;
export const { setFull, clearFull } = dRequestSlice.actions;

export default dRequestSlice.reducer;