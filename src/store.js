import { configureStore } from "@reduxjs/toolkit";
import mapReducer from './reducers/MapSlice';
import dRequestReducer from './reducers/DRequestSlice';

export default configureStore({
    reducer: {
        map: mapReducer,
        dRequest: dRequestReducer,
    }
})