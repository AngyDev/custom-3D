import { useDispatch } from "react-redux";
import { dispatchError } from "../features/error/errorSlice";
import { saveComment } from "../utils/api";

export default function useSaveComment() {
  // const [comments, setComments] = useState({});
  const dispatch = useDispatch();

  return {
    saveComment: async (comment) => {
      await saveComment(comment)
        .then(() => {})
        .catch((error) => {
          dispatch(dispatchError(error.message));
        });
    },
  };
}
