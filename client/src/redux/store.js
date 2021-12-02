import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { commentsReducer } from '../features/comments/commentsSlice';
import { dimensionsReducer } from '../features/dimensions/dimensionsSlice';
import { sceneReducer } from '../features/scene/sceneSlice';

export default configureStore({
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
    reducer: {
        scene: sceneReducer,
        comments: commentsReducer,
        dimensions: dimensionsReducer
    }
})