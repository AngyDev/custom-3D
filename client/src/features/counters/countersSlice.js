import { createSlice } from "@reduxjs/toolkit";

export const countersSlice = createSlice({
  name: "counters",
  initialState: {
    planeCounter: 0,
    commentCounter: 0,
    measureCounter: 0,
    screwCounter: 0,
  },
  reducers: {
    setPlaneCounter: (state, action) => {
      state.planeCounter = action.payload;
    },
    setCommentCounter: (state, action) => {
      state.commentCounter = action.payload;
    },
    setMeasureCounter: (state, action) => {
      state.measureCounter = action.payload;
    },
    setScrewCounter: (state, action) => {
      state.screwCounter = action.payload;
    },
  },
});

export const { incrementPlaneCounter, setPlaneCounter, setCommentCounter, setMeasureCounter, setScrewCounter } = countersSlice.actions;

export const getPlaneCounter = (state) => state.counters.planeCounter;
export const getCommentCounter = (state) => state.counters.commentCounter;
export const getMeasureCounter = (state) => state.counters.measureCounter;
export const getScrewCounter = (state) => state.counters.screwCounter;

export const countersReducer = countersSlice.reducer;
