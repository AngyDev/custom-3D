import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { commentsReducer } from "../features/comments/commentsSlice";
import { countersReducer } from "../features/counters/countersSlice";
import { dimensionsReducer } from "../features/dimensions/dimensionsSlice";
import { errorReducer } from "../features/error/errorSlice";
import { loadingReducer } from "../features/loading/loadingSlice";
import { projectsReducer } from "../features/projects/projectsSlice";
import { sceneReducer } from "../features/scene/sceneSlice";

export default configureStore({
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
  reducer: {
    scene: sceneReducer,
    comments: commentsReducer,
    dimensions: dimensionsReducer,
    error: errorReducer,
    counters: countersReducer,
    projects: projectsReducer,
    loading: loadingReducer,
  },
});
