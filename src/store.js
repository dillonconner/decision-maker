import { configureStore } from "@reduxjs/toolkit";
import mapReducer from './reducers/MapSlice';

export default configureStore({
    reducer: {
        map: mapReducer,
    }
})