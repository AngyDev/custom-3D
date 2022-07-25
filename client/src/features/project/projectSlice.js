import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  project: {},
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload;
    },
    updatedProject: (state, action) => {
      state.project = action.payload;
    },
    resetProject: () => initialState,
  },
});

export const { setProject, updatedProject, resetProject } = projectSlice.actions;

export const getProject = (state) => state.project.project;

export const projectReducer = projectSlice.reducer;
