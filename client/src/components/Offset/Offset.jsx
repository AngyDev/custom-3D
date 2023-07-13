import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import offsetIcon from "../../assets/images/icons/black/pencil-ruler-solid.svg";
import { setLoading } from "../../features/loading/loadingSlice";
import { getScene } from "../../features/scene/sceneSlice";
import { findById } from "../../utils/common-utils";
import { getOffsetMesh } from "../../services/api";
import { createMeshFromObject } from "../../utils/functions/createMeshFromObject";
import Button from "../atoms/Button/Button";

export default function Offset({ meshId }) {
  const scene = useSelector(getScene);
  const dispatch = useDispatch();

  const [newObject, setNewObject] = useState();
  const [offset, setOffset] = useState();

  const meshToOffset = findById(meshId)(scene.children);

  const changeScale = (e) => {
    const { value } = e.target;
    setOffset(value);
  };

  const applyOffset = async () => {
    if (offset !== "1") {
      console.time();

      dispatch(setLoading(true));

      // 1. Export mesh as an ascii file
      const exporter = new STLExporter();
      const result = exporter.parse(meshToOffset, { binary: false });

      // 2. Creates mesh with offset
      const object = await getOffsetMesh(result, offset);
      const mesh = await createMeshFromObject(object);

      mesh.name = "Offset " + meshToOffset.name;

      console.timeEnd();

      dispatch(setLoading(false));

      const offsetMesh = scene.children.filter((item) => item.name === mesh.name);
      if (offsetMesh.length === 0) {
        scene.add(mesh);
      } else {
        scene.remove(offsetMesh[0]);
        scene.add(mesh);
      }

      setNewObject(mesh);
    } else {
      if (newObject !== undefined) {
        scene.remove(newObject);
        setNewObject();
      }
    }
  };

  return (
    <>
      <div className="flex">
        <input type="number" className="mr-2 form__input px-1 py-0 text-base" step="0.1" onChange={changeScale} />
        <Button typeClass="btn--img btn__icon-sm" img={offsetIcon} onClick={applyOffset} />
      </div>
    </>
  );
}

Offset.propTypes = {
  meshId: PropTypes.string.isRequired,
};
