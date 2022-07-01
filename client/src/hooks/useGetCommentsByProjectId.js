import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectComments, setProjectComments } from "../features/comments/commentsSlice";
import { dispatchError } from "../features/error/errorSlice";
import { setLoading } from "../features/loading/loadingSlice";
import { getCommentsByProjectId } from "../utils/api";

export const useGetCommentsByProjectId = () => {
  const dispatch = useDispatch();
  const projectComments = useSelector(getProjectComments);

  const fetchGetCommentsByProjectId = useCallback(
    (projectId, pointId) => {
      dispatch(setLoading(true));
      getCommentsByProjectId(projectId, pointId)
        .then((res) => {
          dispatch(setProjectComments(res.data));
          dispatch(setLoading(false));
        })
        .catch((error) => {
          dispatch(setLoading(false));
          dispatch(dispatchError(error.message));
        });
    },
    [dispatch],
  );

  return {
    fetchGetCommentsByProjectId,
    projectComments,
  };
};