import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import rulerIcon from "../../assets/images/icons/ruler-solid.svg";
import { getCanvas, getChildren, getGroup, getScene, sceneReducer } from "../../features/scene/sceneSlice";
import * as THREE from "three";
import Button from "../Button/Button";
import { getHeaderHeight, getSidebarWidth } from "../../features/dimensions/dimensionsSlice";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

export default function Measurements() {
  const canvas = useSelector(getCanvas);
  const children = useSelector(getChildren);
  const scene = useSelector(getScene);
  const group = useSelector(getGroup);
  const sidebarWidth = useSelector(getSidebarWidth);
  const headerHeight = useSelector(getHeaderHeight);

  let drawingLine = false;
  let ctrlDown = false;

  let line = new THREE.Line();
  let measurementLabels = {};
  let lineId = 0;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const camera = children && children.find((children) => children.type === "PerspectiveCamera");

  const addMeasures = () => {
    window.addEventListener("keydown", function (event) {
      if (event.key === "Control") {
        ctrlDown = true;
        // controls.enabled = false;
        // renderer.domElement.style.cursor = "crosshair";
      }
    });
    window.addEventListener("keyup", function (event) {
      if (event.key === "Control") {
        ctrlDown = false;
        // controls.enabled = true;
        // renderer.domElement.style.cursor = "pointer";
        if (drawingLine) {
          //delete the last line because it wasn't committed
          scene.remove(line);
          scene.remove(measurementLabels[lineId]);
          drawingLine = false;
        }
      }
    });
    canvas.addEventListener("mousedown", onDocumentMouseDown);
    canvas.addEventListener("mousemove", onDocumentMouseMove, false);
  };

  // const onDocumentMouseDown = (event) => {
  //   pointer.x = ((event.clientX - sidebarWidth) / canvas.offsetWidth) * 2 - 1;
  //   pointer.y = -((event.clientY - headerHeight) / canvas.offsetHeight) * 2 + 1;
  //   raycaster.setFromCamera(pointer, camera);

  //   const intersects = raycaster.intersectObjects(group.children, true);

  //   createPoint(intersects);
  // };

  const createPoint = (intersects, name) => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);

    if (intersects.length > 0) {
      sphere.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
      sphere.name = name;

      scene.add(sphere);
    }
  };

  const onDocumentMouseDown = (event) => {
    if (ctrlDown) {
      pointer.x = ((event.clientX - sidebarWidth) / canvas.offsetWidth) * 2 - 1;
      pointer.y = -((event.clientY - headerHeight) / canvas.offsetHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObjects(group.children, true);

      if (intersects.length > 0) {
        if (!drawingLine) {
          //start the line
          const points = [];
          points.push(intersects[0].point);
          points.push(intersects[0].point.clone());

          createPoint(intersects, "A");

          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          line = new THREE.LineSegments(
            geometry,
            new THREE.LineBasicMaterial({
              color: 0xffff00,
              // color: 0xffffff,
              transparent: true,
              linewidth: 100,
              depthTest: false,
              opacity: 0.75,
            })
          );
          line.frustumCulled = false;
          line.name = "M";
          scene.add(line);

          const measurementDiv = document.createElement("div");
          measurementDiv.className = "measurementLabel";
          measurementDiv.innerText = "0.0m";
          const measurementLabel = new CSS2DObject(measurementDiv);
          measurementLabel.position.copy(intersects[0].point);
          measurementLabel.name = "M";
          measurementLabels[lineId] = measurementLabel;
          scene.add(measurementLabels[lineId]);
          drawingLine = true;
        } else {
          //finish the line
          createPoint(intersects, "B");
          const positions = line.geometry.attributes.position.array;
          positions[3] = intersects[0].point.x;
          positions[4] = intersects[0].point.y;
          positions[5] = intersects[0].point.z;
          line.geometry.attributes.position.needsUpdate = true;
          lineId++;
          drawingLine = false;
        }
      }
    }
  };

  const onDocumentMouseMove = (event) => {
    event.preventDefault();

    pointer.x = ((event.clientX - sidebarWidth) / canvas.offsetWidth) * 2 - 1;
    pointer.y = -((event.clientY - headerHeight) / canvas.offsetHeight) * 2 + 1;

    if (drawingLine) {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(group.children, false);
      if (intersects.length > 0) {
        const positions = line.geometry.attributes.position.array;
        const v0 = new THREE.Vector3(positions[0], positions[1], positions[2]);
        const v1 = new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
        positions[3] = intersects[0].point.x;
        positions[4] = intersects[0].point.y;
        positions[5] = intersects[0].point.z;
        line.geometry.attributes.position.needsUpdate = true;
        const distance = v0.distanceTo(v1);
        measurementLabels[lineId].element.innerText = distance.toFixed(2) + "mm";
        measurementLabels[lineId].position.lerpVectors(v0, v1, 0.5);
      }
    }
  };

  return (
    <>
      <Button typeClass="btn--img" img={rulerIcon} onClick={addMeasures} title="Export" />
    </>
  );
}
