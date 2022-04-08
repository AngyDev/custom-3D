import React, { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as THREE from "three";
import offsetIcon from "../../assets/images/icons/black/pencil-ruler-solid.svg";
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
      // const center = getMeshCenter(meshToOffset);

      const geometry = meshToOffset.geometry;

      const position = calculateOffset(geometry);

      const newGeometry = new THREE.BufferGeometry();
      newGeometry.setAttribute("position", new THREE.BufferAttribute(position, 3));

      const newMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 2 });
      const mesh2 = new THREE.Points(newGeometry, newMaterial);
      // const mesh2 = new THREE.Mesh(newGeometry, newMaterial);
      mesh2.position.set(meshToOffset.position.x, meshToOffset.position.y, meshToOffset.position.z);
      mesh2.name = "Offset " + meshToOffset.name;

      // Checks if the mesh is already present
      const offsetMesh = scene.children.filter((item) => item.name === mesh2.name);
      if (offsetMesh.length === 0) {
        scene.add(mesh2);
      } else {
        scene.remove(offsetMesh[0]);
        scene.add(mesh2);
      }

      scene.add(mesh2);
      setNewObject(mesh2);
    } else {
      if (newObject !== undefined) {
        scene.remove(newObject);
        setNewObject();
      }
    }
  };

  /**
   * Calcuates the offset of the mesh
   * @param {BufferGeometry} geometry The geometry of the mesh to offset
   * @returns The position of the vertices after the offset
   */
  const calculateOffset = (geometry) => {
    const vertices = geometry.attributes.position.array;
    const normals = geometry.attributes.normal.array;

    const position = new Float32Array(vertices.length * 3);

    for (let i = 0; i < vertices.length; i = i + 3) {
      position[i] = offset * normals[i] + vertices[i];
      position[i + 1] = offset * normals[i + 1] + vertices[i + 1];
      position[i + 2] = offset * normals[i + 2] + vertices[i + 2];
    }

    return position;
  };

  return (
    <>
      <div className="flex">
        <input type="text" onChange={changeScale} />
        <Button typeClass="btn--img btn__icon" img={offsetIcon} onClick={applyOffset} />
      </div>
    </>
  );
}

Offset.propTypes = {
  mesh: PropTypes.string.isRequired,
};
