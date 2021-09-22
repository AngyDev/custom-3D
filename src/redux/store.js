import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { sceneReducer } from '../features/scene/sceneSlice';

export default configureStore({
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
    reducer: {
        scene: sceneReducer
    }
})