import {configureStore} from '@reduxjs/toolkit';
import userSlice from './userSlice'
import scrollSlice from './scrollSlice';

export default configureStore({
    reducer: {
        user: userSlice,
        scroll: scrollSlice,
    },
});