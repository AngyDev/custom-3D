import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectComments: [],
  comments: [],
  temporaryComments: [],
  isCommentsActive: false,
  isTextOpen: false,
};

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
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
    resetComments: () => initialState,
  },
});

export const { setProjectComments, setCommentsActive, setIsTextOpen, setComments, setTemporaryComments, removeComment, resetComments } =
  commentsSlice.actions;

export const getIsCommentsActive = (state) => state.comments.isCommentsActive;
export const getIsTextOpen = (state) => state.comments.isTextOpen;
export const getComments = (state) => state.comments.comments;
export const getTemporaryComments = (state) => state.comments.temporaryComments;
export const getProjectComments = (state) => state.comments.projectComments;

export const commentsReducer = commentsSlice.reducer;
