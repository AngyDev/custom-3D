import { createSlice } from "@reduxjs/toolkit";

export const sceneSlice = createSlice({
    name: 'scene',
    initialState: {
        scene: {}
    },
    reducers: {
        setScene: (state, action) => {
            state.scene = action.payload;
        }
    }
})


// Action creators are generated for each case reducer function
export const { setScene } = sceneSlice.actions;

export const selectScene = (state) => state.scene.scene;

export const sceneReducer = sceneSlice.reducer;