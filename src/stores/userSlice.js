import { createSlice } from "@reduxjs/toolkit";
import { checkUser } from "./asyncActions";

const initialState = {
    token: null,
    user: null,
    isLoggedIn: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        login: (state, action) => {

            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.user = action.payload.data;
        },

        logout: (state) => {

            state.isLoggedIn = false;
            state.token = null;
            state.user = null
        },

        update: (state, action) => {
            state.user = action.payload
        },

        updateNumnotice: (state, action) => {
            state.numNewNotice = state.numNewNotice + action.payload
        },

        clearNumNotice: (state) => {
            state.numNewNotice = 0
        }
    },
    extraReducers: builder => {
        builder.addCase(checkUser.pending, state => {

        });

        builder.addCase(checkUser.fulfilled, (state, action) => {
            console.log("data", action.payload)
            state.user = action.payload
        });

        builder.addCase(checkUser.rejected, state => {

            state.token = null
            state.user = null
            state.isLoggedIn = false
        });
    },
})

export const { login, logout, update, updateNumnotice, clearNumNotice } = userSlice.actions

export default userSlice.reducer
