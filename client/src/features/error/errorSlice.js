import { createSlice } from "@reduxjs/toolkit";

export const errorSlice = createSlice({
  name: "error",
  initialState: {
    error: "",
  },
  reducers: {
    dispatchError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { dispatchError } = errorSlice.actions;

export const getError = (state) => state.error;

export const errorReducer = errorSlice.reducer;
