import { useDispatch } from "react-redux";
import { resetComments } from "../features/comments/commentsSlice";
import { resetCounters } from "../features/counters/countersSlice";
import { resetMeasures } from "../features/measurements/measurementsSlice";
import { resetObjects } from "../features/objects/objectsSlice";
import { resetProject } from "../features/project/projectSlice";
import { resetProjects } from "../features/projects/projectsSlice";
import { resetScene } from "../features/scene/sceneSlice";

export default function useResetContext() {
  const dispatch = useDispatch();

  const resetContext = () => {
    dispatch(resetScene());
    dispatch(resetProject());
    dispatch(resetProjects());
    dispatch(resetObjects());
    dispatch(resetMeasures());
    dispatch(resetCounters());
    dispatch(resetComments());
  };

  return { resetContext };
}
