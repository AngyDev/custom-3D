import { useDispatch, useSelector } from "react-redux";
import { getComments, setComments } from "../features/comments/commentsSlice";
import { dispatchError } from "../features/error/errorSlice";
import { getCommentsByProjectIdAndPointId } from "../utils/api";

export const useGetCommentsByProjectIdAndPointId = () => {
  const dispatch = useDispatch();
  const comments = useSelector(getComments);

  const fecthGetCommentsByProjectIdPointId = (projectId, pointId) => {
    getCommentsByProjectIdAndPointId(projectId, pointId)
      .then((res) => {
        dispatch(setComments(res.data));
      })
      .catch((error) => {
        dispatch(dispatchError(error.message));
      });
  };

  return {
    fecthGetCommentsByProjectIdPointId,
    comments,
  };
};
