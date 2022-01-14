import React from "react";
import { useSelector } from "react-redux";
import rulerIcon from "../../assets/images/icons/ruler-solid.svg";
import { getCanvas, getChildren, getGroup } from "../../features/scene/sceneSlice";
import * as THREE from "three";
import Button from "../Button/Button";
import { getHeaderHeight, getSidebarWidth } from "../../features/dimensions/dimensionsSlice";

export default function Measurements() {
  const canvas = useSelector(getCanvas);
  const children = useSelector(getChildren);
  const group = useSelector(getGroup);
  const sidebarWidth = useSelector(getSidebarWidth);
  const headerHeight = useSelector(getHeaderHeight);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const camera = children && children.find((children) => children.type === "PerspectiveCamera");

  const addMeasures = () => {
    canvas.addEventListener("mousedown", onDocumentMouseDown);
  };

  const onDocumentMouseDown = (event) => {
    pointer.x = ((event.clientX - sidebarWidth) / canvas.offsetWidth) * 2 - 1;
    pointer.y = -((event.clientY - headerHeight) / canvas.offsetHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(group.children, true);
  };

  return (
    <>
      <Button typeClass="btn--img" img={rulerIcon} onClick={addMeasures} title="Export" />
    </>
  );
}
