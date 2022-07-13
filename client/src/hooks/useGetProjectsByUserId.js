import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dispatchError } from "../features/error/errorSlice";
import { setLoading } from "../features/loading/loadingSlice";
import { getProjects, setProjects } from "../features/projects/projectsSlice";
import { getProjectsByUserId } from "../services/api";

export default function useGetProjectsByUserId() {
  // const userId = "d27db05e-fb3f-4942-a517-59fefbd97937";
  const dispatch = useDispatch();
  const projects = useSelector(getProjects);

  const fetchGetProjectsByUserId = useCallback((userId) => {
    dispatch(setLoading(true));
    getProjectsByUserId(userId)
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
