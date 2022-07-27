import PropTypes from "prop-types";
import React, { useState } from "react";
import heightIcon from "../../assets/images/icons/black/up-down-solid.svg";
import diameterIcon from "../../assets/images/icons/black/circle-notch-solid.svg";
import * as THREE from "three";

import Button from "../atoms/Button/Button";
import { findById } from "../../utils/common-utils";
import { useSelector } from "react-redux";
import { getScene } from "../../features/scene/sceneSlice";

export default function ScaleScrew({ meshId }) {
  const scene = useSelector(getScene);
  const [height, setHeight] = useState();
  const [diameter, setDiameter] = useState();
  const mesh = findById(meshId)(scene.children);

  const changeScale = (e, type) => {
    const { value } = e.target;
    if (type === "height") {
      setHeight(value);
    } else {
      setDiameter(value);
    }
  };

  const applyScale = (type) => {
    if (type === "height" && height) {
      const newGeometry = new THREE.CylinderGeometry(mesh.geometry.parameters.radiusTop, mesh.geometry.parameters.radiusBottom, Number(height), 32);
      mesh.geometry = newGeometry;
    } else {
      const newGeometry = new THREE.CylinderGeometry(Number(diameter), Number(diameter), mesh.geometry.parameters.height, 32);
      mesh.geometry = newGeometry;
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <div className="flex">
          <input
            type="number"
            className="mr-2 form__input px-1 py-0 text-base"
            placeholder="height"
            step="0.1"
            defaultValue={mesh.geometry.parameters.height}
            onChange={(e) => changeScale(e, "height")}
          />
          <Button typeClass="btn--img btn__icon-sm" img={heightIcon} onClick={() => applyScale("height")} />
        </div>
        <div className="flex">
          <input
            type="number"
            className="mr-2 form__input px-1 py-0 text-base"
            placeholder="diameter"
            step="0.1"
            defaultValue={mesh.geometry.parameters.radiusBottom}
            onChange={(e) => changeScale(e, "diameter")}
          />
          <Button typeClass="btn--img btn__icon-sm" img={diameterIcon} onClick={() => applyScale("diameter")} />
        </div>
      </div>
    </>
  );
}

ScaleScrew.propTypes = {
  meshId: PropTypes.string.isRequired,
};
