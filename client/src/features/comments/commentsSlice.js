import { createSlice } from "@reduxjs/toolkit";

export const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    isCommentsActive: false,
    isTextOpen: false,
    countPoint: 1,
  },
  reducers: {
    setCommentsActive: (state, action) => {
      state.isCommentsActive = action.payload;
    },
    setIsTextOpen: (state, action) => {
      state.isTextOpen = action.payload;
    },
    incrementCount: (state) => {
      state.countPoint += 1;
    },
  },
});

export const { setCommentsActive, setIsTextOpen, incrementCount } = commentsSlice.actions;

export const getIsCommentsActive = (state) => state.comments.isCommentsActive;
export const getIsTextOpen = (state) => state.comments.isTextOpen;
export const getCountPoint = (state) => state.comments.countPoint;

export const commentsReducer = commentsSlice.reducer;
