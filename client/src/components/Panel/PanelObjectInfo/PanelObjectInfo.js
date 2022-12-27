import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { getCenter, getNormal } from "../../../utils/functions/objectCalc";
import uploadIcon from "../../../assets/images/icons/white/upload-solid.svg";
import { downloadObject } from "../../../utils/functions/downloadObject";

export default function PanelObjectInfo({ object, panelTopPosition, type }) {
  const objectInfo = useRef();
  const center = getCenter(object);
  const normal = getNormal(object);

  useEffect(() => {
    objectInfo.current.style.top = Math.floor(panelTopPosition) + "px";
  }, []);

  const text = `${center.x.toFixed(3)}, ${center.y.toFixed(3)}, ${center.z.toFixed(3)}\n${normal.x.toFixed(3)}, ${normal.y.toFixed(
    3,
  )}, ${normal.z.toFixed(3)}`;

  const downloadInfo = () => {
    const blob = new Blob([text], { type: "data:text/csv;charset=utf-8" });
    downloadObject(blob, object.name + ".csv");
  };

  return (
    <div
      ref={objectInfo}
      className={`inline-block fixed z-10 py-2 px-3 text-sm font-medium text-white rounded-lg shadow-sm bg-gray-600 dark:bg-base ${
        type === "points" ? "right-80" : "left-80"
      }`}
    >
      <div className="flex justify-between">
        <h3>{object.name} Info</h3>
        <div>
          <img className="w-4 h-4 cursor-pointer" src={uploadIcon} alt="Download info" onClick={downloadInfo} />
        </div>
      </div>
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

PanelObjectInfo.propTypes = {
  object: PropTypes.object.isRequired,
  panelTopPosition: PropTypes.number,
  type: PropTypes.string.isRequired,
};
