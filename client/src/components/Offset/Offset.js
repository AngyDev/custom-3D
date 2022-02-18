import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import offsetIcon from "../../assets/images/icons/pencil-ruler-solid.svg";
import { getScene } from "../../features/scene/sceneSlice";
import useGetMesh from "../../hooks/useGetMesh";
import Button from "../Button/Button";

export default function Offset({ mesh }) {
  const scene = useSelector(getScene);
  const [newObject, setNewObject] = useState();
  const [offset, setOffset] = useState();
  const meshToOffset = useGetMesh(mesh);

  const changeScale = (e) => {
    const { value } = e.target;
    setOffset(value);
  };

  /**
   * Applies the offset to the mesh
   */
  const applyOffset = () => {
    if (offset !== "1") {
      const center = getMeshCenter(meshToOffset);

      if (newObject !== undefined && newObject.name === meshToOffset.name) {
        newObject.geometry.center(center);
        newObject.position.copy(center);
        newObject.scale.set(offset, offset, offset);
        setNewObject(newObject);
      } else {
        const newMesh = new THREE.Mesh(meshToOffset.geometry.clone(), meshToOffset.material.clone());
        newMesh.name = meshToOffset.name;

        newMesh.geometry.center(center);
        newMesh.position.copy(center);
        newMesh.scale.set(offset, offset, offset);

        newMesh.material.transparent = true;
        newMesh.material.opacity = 0.5;

        scene.add(newMesh);
        setNewObject(newMesh);
      }
    } else {
      if (newObject !== undefined) {
        scene.remove(newObject);
        setNewObject();
      }
    }
  };

  /**
   * Gets the center of the mesh to offset
   * @param {Mesh} meshToOffset The mesh to apply the offset
   * @returns The center of the mesh
   */
  const getMeshCenter = (meshToOffset) => {
    const center = new THREE.Vector3();
    const box3 = new THREE.Box3().setFromObject(meshToOffset);
    box3.getCenter(center);

    return center;
  };

  return (
    <>
      <div className="flex">
        <input type="text" onChange={changeScale} />
        <Button typeClass="btn--img" img={offsetIcon} onClick={applyOffset} />
      </div>
    </>
  );
}
