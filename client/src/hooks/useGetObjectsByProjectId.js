import { useEffect, useState } from "react";
import { getObjectsByProjectId } from "../utils/api";

export const useGetObjectsByProjectId = (projectId) => {
  const [objects, setObjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getObjectsByProjectId(projectId)
      .then((res) => {
        setObjects(res.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  return {
    objects,
    error,
  };
};
