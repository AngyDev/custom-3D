import { useDispatch } from "react-redux";
import { dispatchError } from "../features/error/errorSlice";
import { deleteProject } from "../utils/api";

export const useDeleteProject = () => {
  const dispatch = useDispatch();

  const fetchDeleteProject = async (id) => {
    await deleteProject(id)
      .then(() => {})
      .catch((error) => {
        dispatch(dispatchError(error.message));
      });
  };

  return {
    fetchDeleteProject,
  };
};
