import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scene: {},
  renderer: {},
  camera: {},
  sceneModified: false,
  selectedMesh: "",
  positionVector: {},
  controls: {},
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {
    setScene: (state, action) => {
      state.scene = action.payload;
    },
    setRenderer: (state, action) => {
      state.renderer = action.payload;
    },
    setCamera: (state, action) => {
      state.camera = action.payload;
    },
    setSceneModified: (state, action) => {
      state.sceneModified = action.payload;
    },
    setCanvas: (state, action) => {
      state.canvas = action.payload;
    },
    setSelectedMesh: (state, action) => {
      state.selectedMesh = action.payload;
    },
    setPositionVector: (state, action) => {
      state.positionVector = action.payload;
    },
    setControls: (state, action) => {
      state.controls = action.payload;
    },
    resetScene: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { setScene, setSceneModified, setCanvas, setSelectedMesh, setPositionVector, setControls, setRenderer, setCamera, resetScene } =
  sceneSlice.actions;

export const getScene = (state) => state.scene.scene;
export const getPositionVector = (state) => state.scene.positionVector;
export const getChildren = (state) => state.scene.scene.children;
export const getSceneModified = (state) => state.scene.sceneModified;
export const getCanvas = (state) => state.scene.canvas;
export const getGroup = (state) => state.scene.scene.children && state.scene.scene.children.find((obj) => obj.type === "Group");
export const getSelectedMesh = (state) => state.scene.selectedMesh;
export const getControls = (state) => state.scene.controls;
export const getRenderer = (state) => state.scene.renderer;
export const getCamera = (state) => state.scene.camera;

export const sceneReducer = sceneSlice.reducer;
