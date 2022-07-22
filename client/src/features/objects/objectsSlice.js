import { createSlice } from "@reduxjs/toolkit";

export const objectsSlice = createSlice({
  name: "objects",
  initialState: {
    objects: null,
    objectsToRemove: [],
  },
  reducers: {
    setObjects: (state, action) => {
      state.objects = action.payload;
    },
    addObjectToRemove: (state, action) => {
      state.objectsToRemove = [...state.objectsToRemove, action.payload];
    },
    removeObjectFromRemove: (state, action) => {
      state.objectsToRemove = state.objectsToRemove.filter((obj) => obj.id !== action.payload);
      console.log(state.objectsToRemove);
    },
  },
});

export const { setObjects, addObjectToRemove, removeObjectFromRemove } = objectsSlice.actions;

export const getObjects = (state) => state.objects.objects;
export const getObjectsToRemove = (state) => state.objects.objectsToRemove;

export const objectsReducer = objectsSlice.reducer;
