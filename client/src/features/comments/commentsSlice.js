import { createSlice } from "@reduxjs/toolkit";

export const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    isCommentsActive: false,
    isTextOpen: false,
  },
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    setCommentsActive: (state, action) => {
      state.isCommentsActive = action.payload;
    },
    setIsTextOpen: (state, action) => {
      state.isTextOpen = action.payload;
    },
  },
});

export const { setCommentsActive, setIsTextOpen, setComments } = commentsSlice.actions;

export const getIsCommentsActive = (state) => state.comments.isCommentsActive;
export const getIsTextOpen = (state) => state.comments.isTextOpen;
export const getComments = (state) => state.comments.comments;

export const commentsReducer = commentsSlice.reducer;
