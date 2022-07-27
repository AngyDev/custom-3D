import PropTypes from "prop-types";
import React from "react";
import Button from "../atoms/Button/Button";
import screwIcon from "../../assets/images/icons/white/screw.svg";
import { getScene, getSceneModified, setSceneModified, setSelectedMesh } from "../../features/scene/sceneSlice";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import { getScrewCounter, setScrewCounter } from "../../features/counters/countersSlice";

export default function AddScrew({ setOpenScrew }) {
  const dispatch = useDispatch();
  const scene = useSelector(getScene);
  const isModified = useSelector(getSceneModified);
  const screwCounter = useSelector(getScrewCounter);
  const tControls = scene.children && scene.children.find((obj) => obj.name === "TransformControls");

  const addScrew = () => {
    const screw = createScrew();
    scene.add(screw);

    tControls.attach(screw);
    tControls.setMode("translate");

    setOpenScrew(true);
    dispatch(setSelectedMesh(screw.uuid));
    dispatch(setSceneModified(!isModified));
  };

  const createScrew = () => {
    const geometry = new THREE.CylinderGeometry(3, 3, 20, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x4b4b4b });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.name = "Screw" + (screwCounter + 1);

    dispatch(setScrewCounter(screwCounter + 1));

    return cylinder;
  };

  return <Button typeClass="btn--img btn__icon h-auto" img={screwIcon} onClick={addScrew} title="Add screw" />;
}

AddScrew.propTypes = {
  setOpenScrew: PropTypes.func.isRequired,
};
