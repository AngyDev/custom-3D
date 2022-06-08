import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { dispatchError } from "../features/error/errorSlice";
import { getProjectsByUserId } from "../utils/api";

export default function useGetProjectsByUserId() {
  const [projects, setProjects] = useState({});
  const userId = "d27db05e-fb3f-4942-a517-59fefbd97937";
  const dispatch = useDispatch();

  useEffect(() => {
    getProjectsByUserId(userId)
      .then((res) => {
        setProjects(res.data);
      })
      .catch((error) => {
        dispatch(dispatchError(error.message));
      });
  }, []);

  return {
    projects,
  };
}
