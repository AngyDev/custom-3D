import { createSlice } from "@reduxjs/toolkit";

export const sceneSlice = createSlice({
    name: 'scene',
    initialState: {
        scene: {},
        sceneModified: false
    },
    reducers: {
        setScene: (state, action) => {
            state.scene = action.payload;
        },
        setSceneModified: (state, action) => {
            state.modified = action.payload;
        }
    }
})


// Action creators are generated for each case reducer function
export const { setScene, setGroup, setSceneModified } = sceneSlice.actions;

export const getScene = (state) => state.scene.scene;

export const getChildrens = (state) => state.scene.scene.children;
export const getSceneModified = (state) => state.scene.modified;

export const getGroup = (state) => state.scene.scene.children && state.scene.scene.children.find((obj) => obj.type === "Group");

export const sceneReducer = sceneSlice.reducer;