import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import rulerIcon from "../../assets/images/icons/ruler-solid.svg";
import { getHeaderHeight, getSidebarWidth } from "../../features/dimensions/dimensionsSlice";
import { getCanvas, getChildren, getGroup, getScene, getSceneModified, setSceneModified } from "../../features/scene/sceneSlice";
import Button from "../Button/Button";

export default function Measurements({ openPanel, setOpenPanel }) {
  const canvas = useSelector(getCanvas);
  const children = useSelector(getChildren);
  const scene = useSelector(getScene);
  const group = useSelector(getGroup);
  const sidebarWidth = useSelector(getSidebarWidth);
  const headerHeight = useSelector(getHeaderHeight);
  const isModified = useSelector(getSceneModified);
  const dispatch = useDispatch();

  const [event, setEvent] = useState(false);
  const [finish, setFinish] = useState(false);

  let drawingLine = false;
  let ctrlDown = false;

  let line = new THREE.Line();
  let measurementLabels = {};
  let lineId = 0;
  let count = 1;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const camera = children && children.find((children) => children.type === "PerspectiveCamera");

  useEffect(() => {
    if (finish) {
      dispatch(setSceneModified(!isModified));
      setFinish(false);
    }
  }, [finish]);

  const addMeasures = () => {
    if (!openPanel) {
      setOpenPanel(true);
    }

    if (event) {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      setEvent(false);
    } else {
      window.addEventListener("keydown", onKeyDown, false);
      window.addEventListener("keyup", onKeyUp, false);
    }
    canvas.addEventListener("mousedown", onDocumentMouseDown, false);
    canvas.addEventListener("mousemove", onDocumentMouseMove, false);
  };

  const onKeyDown = (event) => {
    if (event.key === "Control") {
      ctrlDown = true;
      // controls.enabled = false;
      // renderer.domElement.style.cursor = "crosshair";
    }
  };

  const onKeyUp = (event) => {
    if (event.key === "Control") {
      ctrlDown = false;
      // controls.enabled = true;
      // renderer.domElement.style.cursor = "pointer";
      if (drawingLine) {
        //delete the last line because it wasn't committed
        scene.remove(line);
        scene.remove(measurementLabels[lineId]);
        // and the point
        scene.children.forEach((object) => {
          if (object.name === "Measure" + count) {
            scene.remove(object);
          }
        });

        drawingLine = false;
      }
    }
  };

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

          createPoint(intersects, "Measure" + count);

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
            }),
          );
          line.frustumCulled = false;
          line.name = "Measure" + count;
          scene.add(line);

          const measurementDiv = document.createElement("div");
          measurementDiv.className = "measurementLabel";
          measurementDiv.innerText = "0.0m";
          measurementDiv.id = "Measure" + count;
          const measurementLabel = new CSS2DObject(measurementDiv);
          measurementLabel.position.copy(intersects[0].point);
          measurementLabel.name = "Measure" + count;
          measurementLabels[lineId] = measurementLabel;
          scene.add(measurementLabels[lineId]);
          drawingLine = true;
        } else {
          //finish the line
          createPoint(intersects, "Measure" + count);
          const positions = line.geometry.attributes.position.array;
          positions[3] = intersects[0].point.x;
          positions[4] = intersects[0].point.y;
          positions[5] = intersects[0].point.z;
          line.geometry.attributes.position.needsUpdate = true;
          lineId++;

          createMeasureGroup();

          // Increment the counter
          count++;
          drawingLine = false;

          setEvent(true);
          setFinish(true);
        }
      }
    }
  };

  /**
   * Creates a group of measure object
   * For each Measure there is 4 object, 2 point, 1 line and 1 label
   */
  const createMeasureGroup = () => {
    let array = [];
    children.forEach((object) => {
      if (object.name === "Measure" + count && object.type !== "Group") {
        array.push(object);
      }
    });

    const groupMeasure = new THREE.Group();

    array.forEach((object) => {
      groupMeasure.add(object);
    });
    groupMeasure.name = "Measure" + count;
    scene.add(groupMeasure);
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
    <div className="popover__wrapper">
      <Button typeClass="btn--img button" img={rulerIcon} onClick={addMeasures} />
      <div className="popover__content">
        <p className="popover__message">
          Press CTRL + Left Mouse Click to start drawing a line. Continue to hold CTRL and Left Mouse Click again to mark the end of the line
        </p>
      </div>
    </div>
  );
}

Measurements.propTypes = {
  setEvent: PropTypes.func,
  setFinish: PropTypes.func,
};
