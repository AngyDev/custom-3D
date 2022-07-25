import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  objects: null,
  objectsToRemove: [],
};

export const objectsSlice = createSlice({
  name: "objects",
  initialState,
  reducers: {
    setObjects: (state, action) => {
      state.objects = action.payload;
    },
    addObjectToRemove: (state, action) => {
      state.objectsToRemove = [...state.objectsToRemove, action.payload];
    },
    removeObjectFromRemove: (state, action) => {
      state.objectsToRemove = state.objectsToRemove.filter((obj) => obj.id !== action.payload);
    },
    resetObjects: () => initialState,
  },
});

export const { setObjects, addObjectToRemove, removeObjectFromRemove, resetObjects } = objectsSlice.actions;

export const getObjects = (state) => state.objects.objects;
export const getObjectsToRemove = (state) => state.objects.objectsToRemove;

export const objectsReducer = objectsSlice.reducer;
