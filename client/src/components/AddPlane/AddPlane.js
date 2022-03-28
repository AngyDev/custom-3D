import React, { useState } from "react";
import Button from "../Button/Button";
import * as THREE from "three";
import { useDispatch, useSelector } from "react-redux";
import { getScene, getSceneModified, setSceneModified, setSelectedMesh } from "../../features/scene/sceneSlice";

export default function AddPlane() {
  const [counter, setCounter] = useState(1);
  const scene = useSelector(getScene);
  const isModified = useSelector(getSceneModified);
  const dispatch = useDispatch();

  const tControls = scene.children && scene.children.find((obj) => obj.name === "TransformControls");

  /**
   * Adds plane to the scene
   */
  const addPlane = () => {
    const plane = createPlane();
    scene.add(plane);

    tControls.attach(plane);
    tControls.setMode("translate");

    dispatch(setSelectedMesh(plane.uuid));
    dispatch(setSceneModified(!isModified));
  };

  /**
   * Creates the mesh of the plane
   * @returns Mesh
   */
  const createPlane = () => {
    var geometry = new THREE.PlaneGeometry(50, 50, 1, 1);
    var material = new THREE.MeshStandardMaterial({
      color: "#38382f",
      side: THREE.DoubleSide,
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Plane" + counter;

    setCounter((counter) => counter + 1);

    return mesh;
  };

  return <Button typeClass="btn--size" text="ADD PLANE" onClick={addPlane} />;
}
