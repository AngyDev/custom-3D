import { createSlice } from "@reduxjs/toolkit";

export const countersSlice = createSlice({
  name: "counters",
  initialState: {
    planeCounter: 0,
    commentCounter: 0,
  },
  reducers: {
    setPlaneCounter: (state, action) => {
      state.planeCounter = action.payload;
    },
    setCommentCounter: (state, action) => {
      state.commentCounter = action.payload;
    },
  },
});

export const { incrementPlaneCounter, setPlaneCounter, setCommentCounter } = countersSlice.actions;

export const getPlaneCounter = (state) => state.counters.planeCounter;
export const getCommentCounter = (state) => state.counters.commentCounter;

export const countersReducer = countersSlice.reducer;
