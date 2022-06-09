import { createSlice } from "@reduxjs/toolkit";

export const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
  },
});

export const { setProjects } = projectsSlice.actions;

export const getProjects = (state) => state.projects.projects;

export const projectsReducer = projectsSlice.reducer;
