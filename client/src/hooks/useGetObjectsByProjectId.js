import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dispatchError } from "../features/error/errorSlice";
import { setLoading } from "../features/loading/loadingSlice";
import { getObjects, setObjects } from "../features/objects/objectsSlice";
import { getObjectsByProjectId } from "../services/api";

export const useGetObjectsByProjectId = () => {
  const objects = useSelector(getObjects);
  const dispatch = useDispatch();

  const fetchGetObjectsByProjectId = useCallback(
    (projectId) => {
      dispatch(setLoading(true));
      getObjectsByProjectId(projectId)
        .then((res) => {
          dispatch(setObjects(res.data));
          dispatch(setLoading(false));
        })
        .catch((error) => {
          dispatch(setLoading(false));
          dispatch(dispatchError(error));
        });
    },
    [dispatch],
  );

  return {
    objects,
    fetchGetObjectsByProjectId,
  };
};
