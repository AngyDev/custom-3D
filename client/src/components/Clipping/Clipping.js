import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import clipping from "../../assets/images/icons/white/cut-solid.svg";
import { getGroup, getPositionVector, getScene, getSceneModified } from "../../features/scene/sceneSlice";
import { addColorToClippedMesh } from "../../utils/functions/clippingObject";
import Button from "../atoms/Button/Button";
import { Checkbox } from "../atoms/Checkbox/Checkbox";

export default function Clipping() {
  const scene = useSelector(getScene);
  const group = useSelector(getGroup);
  const sceneModified = useSelector(getSceneModified);
  const positionVector = useSelector(getPositionVector);

  const [clipped, setClipped] = useState(false);
  const [planes, setPlanes] = useState([]);
  const [planesOriginal, setPlanesOriginal] = useState([]);
  const [globalClipping, setGlobalClipping] = useState(false);
  const [active, setActive] = useState(false);

  // The clipping button is disabled if there is only one plane
  useEffect(() => {
    setGlobalClipping(scene.children && scene.children.filter((object) => object.name.startsWith("Plane")).length <= 1);
  }, [sceneModified]);

  /**
   * Clipping of the mesh by the planes
   */
  const clipMesh = () => {
    setActive(!active);
    const result = scene.children.filter((object) => object.name.startsWith("Clipping"));

    if (result.length === 0) {
      const createdPlanes = createPlanesAndNegated();
      // Creates the clipping object with colors
      addColorToClippedMesh(scene, group, positionVector, createdPlanes, createdPlanes, false);

      group.children.map((object) => {
        object.material.clipIntersection = false;
      });

      // Saves the planes in another array to use it in the handleNegate function
      const planesOriginal = createdPlanes.map((item) => item.clone());

      setPlanes(createdPlanes);
      setPlanesOriginal(planesOriginal);
    } else {
      scene.children
        .filter((object) => object.name.startsWith("Clipping"))
        .map((object) => {
          scene.remove(object);
        });

      setPlanes([]);
      setPlanesOriginal([]);

      group.children.map((mesh) => {
        mesh.material.clippingPlanes = [];
      });
    }

    setClipped((prev) => !prev);
  };

  /**
   * Creates a plane as THREE.Plane from THREE.PlaneGeometry
   * Calculates the barycenter of the planes
   * Gets the distance from the plane and the barycenter
   * Negates only the plane with negative distance
   * @returns A list of planes with the correct targeting
   */
  const createPlanesAndNegated = () => {
    const planesGeometry = scene.children.filter((object) => object.name.startsWith("Plane"));
    const normals = [];
    const centers = [];

    const planes = [];

    planesGeometry.forEach((item) => {
      const plane = new THREE.Plane();
      const normal = new THREE.Vector3();
      const point = new THREE.Vector3();

      // Gets the centers of the planes
      const center = getCenterPoint(item);
      centers.push(center);

      // Creates the THREE.Plane from THREE.PlaneGeometry
      normal.set(0, 0, 1).applyQuaternion(item.quaternion);
      point.copy(item.position);
      plane.setFromNormalAndCoplanarPoint(normal, point);

      // Saves the normals of the planes
      normals.push(plane.normal);

      planes.push(plane);
    });

    // Calculates the barycenter of the planes
    const pointx = centers.reduce((prev, curr) => prev + curr.x, 0) / centers.length;
    const pointy = centers.reduce((prev, curr) => prev + curr.y, 0) / centers.length;
    const pointz = centers.reduce((prev, curr) => prev + curr.z, 0) / centers.length;
    const barycenter = new THREE.Vector3(pointx, pointy, pointz);

    const distances = [];

    // Gets the distance from the plane and the barycenter
    planes.forEach((item) => {
      distances.push(item.distanceToPoint(barycenter));
    });

    // Negates only the plane with negative distance
    distances.forEach((distance, index) => {
      if (distance < 0) {
        planes[index].negate();
      }
    });

    return planes;
  };

  /**
   * Gets the center of the mesh
   * @param {Object} mesh THREE.Mesh
   * @returns The center of the mesh
   */
  const getCenterPoint = (mesh) => {
    var geometry = mesh.geometry;
    geometry.computeBoundingBox();
    var center = new THREE.Vector3();
    geometry.boundingBox.getCenter(center);
    mesh.localToWorld(center);
    return center;
  };

  let count = 0;

  const handleNegated = () => {
    count++;
    const result = scene.children.filter((object) => object.name.startsWith("Clipping"));

    if (result.length > 0) {
      // removes the previous clipping object
      scene.children
        .filter((object) => object.name.startsWith("Clipping"))
        .map((object) => {
          scene.remove(object);
        });
    }

    if (count % 2 != 0) {
      planes.forEach((item) => item.negate());

      // removes the previous clipping planes with negated planes for the mesh and original planes for the colored planes
      addColorToClippedMesh(scene, group, positionVector, planes, planesOriginal, true);

      group.children.map((object) => {
        object.material.clipIntersection = true;
      });
    } else {
      planes.forEach((item) => item.negate());

      // removes the previous clipping planes with negated planes for the mesh and original planes for the colored planes
      addColorToClippedMesh(scene, group, positionVector, planesOriginal, planesOriginal, false);

      group.children.map((object) => {
        object.material.clipIntersection = false;
      });
    }
  };

  return (
    <div className="flex items-center">
      <Button typeClass="btn--img btn__icon" img={clipping} onClick={clipMesh} disabled={globalClipping} active={active} title="Clipping" />
      {clipped && (
        <span style={{ marginLeft: "10px" }}>
          <Checkbox label="Negated" onChange={handleNegated} className="text-white" />
        </span>
      )}
    </div>
  );
}
