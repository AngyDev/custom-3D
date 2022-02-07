import React, { useEffect, useState } from "react";
import clipping from "../../assets/images/icons/cut-solid.svg";
import * as THREE from "three";
import { LogLuvEncoding, Vector3 } from "three";
import Button from "../Button/Button";
import { useSelector } from "react-redux";
import { getGroup, getScene } from "../../features/scene/sceneSlice";

export default function Clipping() {
  const scene = useSelector(getScene);
  const group = useSelector(getGroup);

  const [clipped, setClipped] = useState(false);
  const [planeLists, setPlaneLists] = useState([]);
  const [globalClipping, setGlobalClipping] = useState(false);

  // The clipping button is disabled if there is only one plane
  useEffect(() => {
    setGlobalClipping(scene.children && scene.children.filter((object) => object.name.startsWith("Plane")).length <= 1)
  });

  /**
   * Clipping of the mesh by the planes
   */
  const clipMesh = () => {
    const planes = scene.children.filter((object) => object.name.startsWith("Plane"));
    const normals = [];
    const centers = [];

    const planeList = [];

    planes.forEach((item) => {
      const plane = new THREE.Plane();
      const normal = new THREE.Vector3();
      const point = new THREE.Vector3();

      // Gets the ceters of the planes
      const center = getCenterPoint(item);
      centers.push(center);

      // Creates the THREE.Plane from THREE.PlaneGeometry
      normal.set(0, 0, 1).applyQuaternion(item.quaternion);
      point.copy(item.position);
      plane.setFromNormalAndCoplanarPoint(normal, point);

      // Saves the normals of the planes
      normals.push(plane.normal);

      planeList.push(plane);
    });

    // Calculates the barycenter of the planes
    const pointx = centers.reduce((prev, curr) => prev + curr.x, 0) / centers.length;
    const pointy = centers.reduce((prev, curr) => prev + curr.y, 0) / centers.length;
    const pointz = centers.reduce((prev, curr) => prev + curr.z, 0) / centers.length;
    const barycenter = new THREE.Vector3(pointx, pointy, pointz);

    const distances = [];

    // Gets the distance from the plane and the barycenter
    planeList.forEach((item) => {
      distances.push(item.distanceToPoint(barycenter));
    });

    // Negates only the plane with negative distance
    distances.forEach((distance, index) => {
      if (distance < 0) {
        planeList[index].negate();
      }
    });

    group.children.map((object) => {
      if (!object.material.clippingPlanes || object.material.clippingPlanes.length === 0) {
        object.material.clippingPlanes = planeList;
        object.material.clipIntersection = false;
      } else {
        object.material.clippingPlanes = [];
      }
    });

    setPlaneLists(planeList);
    setClipped((prev) => !prev);
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

  const handleNegated = () => {
    planeLists.forEach((item) => item.negate());

    group.children.map((object) => {
      object.material.clipIntersection = !object.material.clipIntersection;
    });
  };

  return (
    <>
      <Button typeClass="btn--img" img={clipping} onClick={clipMesh} disabled={globalClipping}/>
      {clipped && (
        <span>
          <input type="checkbox" name="" id="plane1" onChange={handleNegated} />
          <label htmlFor="plane1">Negated</label>
        </span>
      )}
    </>
  );
}
