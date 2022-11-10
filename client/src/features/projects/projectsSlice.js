import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    resetProjects: () => initialState,
  },
});

export const { setProjects, resetProjects } = projectsSlice.actions;

export const getProjects = (state) => state.projects.projects;

export const projectsReducer = projectsSlice.reducer;
