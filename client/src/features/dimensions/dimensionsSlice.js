import { createSlice } from "@reduxjs/toolkit";

export const dimensionsSlice = createSlice({
  name: "dimensions",
  initialState: {
    sidebar: 330,
    header: 62,
  },
  reducers: {
    setSidebarWidth: (state, action) => {
      state.sidebar = action.payload;
    },
    setHeaderHeight: (state, action) => {
      state.header = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setHeaderHeight, setSidebarWidth } = dimensionsSlice.actions;

export const getSidebarWidth = (state) => state.dimensions.sidebar;
export const getHeaderHeight = (state) => state.dimensions.header;

export const dimensionsReducer = dimensionsSlice.reducer;
