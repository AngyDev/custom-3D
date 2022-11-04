import { createSlice } from "@reduxjs/toolkit";

export const errorSlice = createSlice({
  name: "error",
  initialState: {
    error: "",
  },
  reducers: {
    dispatchError: (state, action) => {
      let errorText = "";

      if (action.payload !== "") {
        let errorMessage = "";

        if (action.payload.response) {
          action.payload.response.status === 500 ? (errorMessage = "Internal server error") : (errorMessage = action.payload.response.data.error);
          errorText = action.payload.response?.status + " " + errorMessage;
        } else if (action.payload.message) {
          errorText = action.payload.message;
        } else {
          errorText = action.payload;
        }
      }

      state.error = errorText;
    },
  },
});

export const { dispatchError } = errorSlice.actions;

export const getError = (state) => state.error;

export const errorReducer = errorSlice.reducer;
