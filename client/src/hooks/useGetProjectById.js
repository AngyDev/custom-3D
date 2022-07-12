import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dispatchError } from "../features/error/errorSlice";
import { getProject, setProject } from "../features/project/projectSlice";
import { getProjectById } from "../services/api";

export default function useGetProjectById() {
  const project = useSelector(getProject);
  const dispatch = useDispatch();

  const fetchGetProjectById = useCallback((id) => {
    getProjectById(id)
      .then((res) => {
        dispatch(setProject(res.data));
        // setProject(res.data);
      })
      .catch((error) => {
        dispatch(dispatchError(error.message));
      });
  }, []);

  return {
    project,
    fetchGetProjectById,
  };
}
