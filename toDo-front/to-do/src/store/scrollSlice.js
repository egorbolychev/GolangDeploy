import { createSlice } from "@reduxjs/toolkit";

const scrollSlice = createSlice({
    name: 'scroll',
    initialState: {
        isScrollActive: true
    },
    reducers: {
        setIsScrollActive(state, action) {
            state.isScrollActive = action.payload.isScrollActive
        },
    }
})

export const { setIsScrollActive } = scrollSlice.actions;
 
export default scrollSlice.reducer;