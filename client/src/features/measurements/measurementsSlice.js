import { createSlice } from "@reduxjs/toolkit";

export const measurementsSlice = createSlice({
  name: "measurements",
  initialState: {
    openMeausurePanel: false,
  },
  reducers: {
    setOpenMeausurePanel: (state, action) => {
      state.openMeausurePanel = action.payload;
    },
  },
});

export const { setOpenMeausurePanel } = measurementsSlice.actions;

export const getOpenMeausurePanel = (state) => state.measurements.openMeausurePanel;

export const measurementsReducer = measurementsSlice.reducer;
