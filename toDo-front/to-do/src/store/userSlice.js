import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: '',
        token: '',
        email: '',
        login: '',
    },
    reducers: {
        setUser(state, action) {
            state.id = action.payload.id
            state.token = action.payload.token
            state.email = action.payload.email
            state.login = action.payload.login
            console.log(state.api_token)
        },

        setTimezone(state, action) {
            state.timezone = action.payload.timezone
        },

        removeUser(state) {
            state.id = ''
            state.token = ''
            state.email = ''
            state.login = ''
            localStorage.clear()
        },
    }
})

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;