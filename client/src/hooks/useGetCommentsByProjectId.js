import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjectComments, setProjectComments } from "../features/comments/commentsSlice";
import { dispatchError } from "../features/error/errorSlice";
import { setLoading } from "../features/loading/loadingSlice";
import { getCommentsByProjectId } from "../services/api";

export const useGetCommentsByProjectId = () => {
  const dispatch = useDispatch();
  const projectComments = useSelector(getProjectComments);

  const fetchGetCommentsByProjectId = useCallback(
    (projectId) => {
      dispatch(setLoading(true));
      getCommentsByProjectId(projectId)
        .then((res) => {
          dispatch(setProjectComments(res.data));
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
    fetchGetCommentsByProjectId,
    projectComments,
  };
};
