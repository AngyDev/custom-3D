import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import { getPlaneCounter, setPlaneCounter } from "../../features/counters/countersSlice";
import { getScene, getSceneModified, setSceneModified, setSelectedMesh } from "../../features/scene/sceneSlice";
import Button from "../Button/Button";

export default function AddPlane() {
  const planeCounter = useSelector(getPlaneCounter);
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
    const geometry = new THREE.PlaneGeometry(50, 50, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: "#38382f",
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Plane" + (planeCounter + 1);

    dispatch(setPlaneCounter(planeCounter + 1));

    return mesh;
  };

  return <Button typeClass="btn--size" text="ADD PLANE" onClick={addPlane} />;
}
