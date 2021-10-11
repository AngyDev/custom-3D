import { createSlice } from "@reduxjs/toolkit";

export const commentsSlice = createSlice({
    name: 'comments',
    initialState: {
        isCommentsActive: false
    },
    reducers: {
        setCommentsActive: (state, action) => {
            state.isCommentsActive = action.payload;
        }
    }
})


export const { setCommentsActive } = commentsSlice.actions;

export const getIsCommentsActive = (state) => state.comments.isCommentsActive;

export const commentsReducer = commentsSlice.reducer;