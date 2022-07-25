import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openMeausurePanel: false,
};

export const measurementsSlice = createSlice({
  name: "measurements",
  initialState,
  reducers: {
    setOpenMeausurePanel: (state, action) => {
      state.openMeausurePanel = action.payload;
    },
    resetMeasures: () => initialState,
  },
});

export const { setOpenMeausurePanel, resetMeasures } = measurementsSlice.actions;

export const getOpenMeausurePanel = (state) => state.measurements.openMeausurePanel;

export const measurementsReducer = measurementsSlice.reducer;
