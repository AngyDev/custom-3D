import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { getCenter, getNormal } from "../../../utils/functions/objectCalc";

export default function PanelPlaneInfo({ plane }) {
  console.log(plane);
  const [center, setCenter] = useState();
  const [normal, setNormal] = useState();

  useEffect(() => {
    if (Object.keys(plane).length > 0) {
      setCenter(getCenter(plane));
      setNormal(getNormal(plane));
    }
  }, [plane]);

  return (
    <div className="inline-block absolute left-80 z-10 py-2 px-3 text-sm font-medium text-white rounded-lg shadow-sm bg-gray-600 dark:bg-base">
      <h3>{plane.name} Info</h3>
      <div className="flex flex-col">
        <div className="flex gap-2">
          <span>Normal: </span>
          <span>x: {normal && normal.x.toFixed(3)}</span>
          <span>y: {normal && normal.y.toFixed(3)}</span>
          <span>z: {normal && normal.z.toFixed(3)}</span>
        </div>
        <div className="flex gap-2">
          <span>Center: </span>
          <span>x: {center && center.x.toFixed(3)}</span>
          <span>y: {center && center.y.toFixed(3)}</span>
          <span>z: {center && center.z.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
}

PanelPlaneInfo.propTypes = {
  plane: PropTypes.object.isRequired,
};
