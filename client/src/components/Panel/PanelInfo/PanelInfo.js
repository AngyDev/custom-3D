import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getGroup, getSceneModified } from "../../../features/scene/sceneSlice";

export default function PanelInfo() {
  const sceneModified = useSelector(getSceneModified);
  const group = useSelector(getGroup);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (group && Object.keys(group).length > 0) {
      if (group.children.length > 0) {
        let sum = 0;
        group.children.forEach((child) => {
          sum += child.geometry.attributes.position.count;
          setCount(sum);
        });
      }
    }
  }, [sceneModified]);

  return (
    <div className="absolute bottom-0 left-80 p-4 flex flex-col">
      <div>
        <span>Vertices: </span>
        <span>{count}</span>
      </div>
      <div>
        <span>Triangles: </span>
        <span>{count / 3}</span>
      </div>
    </div>
  );
}
