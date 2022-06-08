import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { dispatchError } from "../features/error/errorSlice";
import { getProjectById } from "../utils/api";

export default function useGetProjectById(id) {
  const [project, setProject] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    getProjectById(id)
      .then((res) => {
        setProject(res.data);
      })
      .catch((error) => {
        dispatch(dispatchError(error.message));
      });
  }, []);

  return {
    project,
  };
}
