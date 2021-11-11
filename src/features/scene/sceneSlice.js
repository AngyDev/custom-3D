import { createSlice } from "@reduxjs/toolkit";

export const sceneSlice = createSlice({
    name: 'scene',
    initialState: {
        scene: {},
        sceneModified: false,
        selected: {}
    },
    reducers: {
        setScene: (state, action) => {
            state.scene = action.payload;
        },
        setSceneModified: (state, action) => {
            state.sceneModified = action.payload;
        },
        setCanvas: (state, action) => {
            state.canvas = action.payload;
        },
        setSelected: (state, action) => {
            state.selected = action.payload;
        }
    }
})


// Action creators are generated for each case reducer function
export const { setScene, setSceneModified, setCanvas, setSelected } = sceneSlice.actions;

export const getScene = (state) => state.scene.scene;

export const getChildren = (state) => state.scene.scene.children;
export const getSceneModified = (state) => state.scene.sceneModified;
export const getCanvas = (state) => state.scene.canvas;
export const getGroup = (state) => state.scene.scene.children && state.scene.scene.children.find((obj) => obj.type === "Group");
export const getSelected = (state) => state.scene.selected;

export const sceneReducer = sceneSlice.reducer;