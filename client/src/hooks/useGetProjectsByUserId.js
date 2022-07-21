import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dispatchError } from "../features/error/errorSlice";
import { setLoading } from "../features/loading/loadingSlice";
import { getProjects, setProjects } from "../features/projects/projectsSlice";
import { getProjectsByUserId } from "../services/api";

export default function useGetProjectsByUserId() {
  const dispatch = useDispatch();
  const projects = useSelector(getProjects);

  const fetchGetProjectsByUserId = useCallback((userId, archived) => {
    dispatch(setLoading(true));
    getProjectsByUserId(userId, archived)
      .then((response) => {
        dispatch(setProjects(response.data));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        dispatch(dispatchError(error));
        dispatch(setLoading(false));
      });
  }, []);

  return {
    fetchGetProjectsByUserId,
    projects,
  };
}
