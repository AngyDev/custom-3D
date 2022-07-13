import { useDispatch, useSelector } from "react-redux";
import { getComments, setComments } from "../features/comments/commentsSlice";
import { dispatchError } from "../features/error/errorSlice";
import { getCommentsByProjectIdAndPointId } from "../utils/api";

export const useGetCommentsByProjectIdAndPointId = () => {
  const dispatch = useDispatch();
  const comments = useSelector(getComments);

  const fetchGetCommentsByProjectIdPointId = (projectId, pointId) => {
    getCommentsByProjectIdAndPointId(projectId, pointId)
      .then((res) => {
        dispatch(setComments(res.data));
      })
      .catch((error) => {
        dispatch(dispatchError(error));
      });
  };

  return {
    fetchGetCommentsByProjectIdPointId,
    comments,
  };
};
