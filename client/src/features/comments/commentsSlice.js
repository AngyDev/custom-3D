import { createSlice } from "@reduxjs/toolkit";

export const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    projectComments: [],
    comments: [],
    temporaryComments: [],
    isCommentsActive: false,
    isTextOpen: false,
  },
  reducers: {
    setProjectComments: (state, action) => {
      state.projectComments = action.payload;
      state.temporaryComments = action.payload;
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    setCommentsActive: (state, action) => {
      state.isCommentsActive = action.payload;
    },
    setIsTextOpen: (state, action) => {
      state.isTextOpen = action.payload;
    },
    setTemporaryComments: (state, action) => {
      state.temporaryComments = [...state.temporaryComments, action.payload];
    },
    removeComment: (state, action) => {
      state.temporaryComments = state.temporaryComments.filter((item) => item.text !== action.payload.text);
    },
  },
});

export const { setProjectComments, setCommentsActive, setIsTextOpen, setComments, setTemporaryComments, removeComment } = commentsSlice.actions;

export const getIsCommentsActive = (state) => state.comments.isCommentsActive;
export const getIsTextOpen = (state) => state.comments.isTextOpen;
export const getComments = (state) => state.comments.comments;
export const getTemporaryComments = (state) => state.comments.temporaryComments;
export const getProjectComments = (state) => state.comments.projectComments;

export const commentsReducer = commentsSlice.reducer;
