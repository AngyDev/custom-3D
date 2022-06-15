import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;

export const getLoading = (state) => state.loading.loading;

export const loadingReducer = loadingSlice.reducer;
