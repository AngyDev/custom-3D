import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getScene } from "../features/scene/sceneSlice";

export default function useGetMesh(id) {
  const [mesh, setMesh] = useState();
  const scene = useSelector(getScene);

  useEffect(() => {
    scene.children.forEach((object) => {
      if (object.type === "Group") {
        object.children.forEach((item) => {
          if (item.uuid === id) {
            setMesh(item);
          }
        });
      } else if (object.uuid === id) {
        setMesh(object);
      }
    });
  }, []);

  return mesh;
}
