import { createSlice } from "@reduxjs/toolkit";

export const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    isCommentsActive: false,
    isTextOpen: false,
  },
  reducers: {
    setCommentsActive: (state, action) => {
      state.isCommentsActive = action.payload;
    },
    setIsTextOpen: (state, action) => {
      state.isTextOpen = action.payload;
    },
  },
});

export const { setCommentsActive, setIsTextOpen } = commentsSlice.actions;

export const getIsCommentsActive = (state) => state.comments.isCommentsActive;
export const getIsTextOpen = (state) => state.comments.isTextOpen;

export const commentsReducer = commentsSlice.reducer;
