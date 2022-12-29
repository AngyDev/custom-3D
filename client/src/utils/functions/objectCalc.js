import * as THREE from "three";

/**
 * Gets the center of the mesh
 * @param {Object} object The mesh
 * @returns The center
 */
export const getCenter = (object) => {
  const center = new THREE.Vector3();

  const box3 = new THREE.Box3().setFromObject(object);
  box3.getCenter(center);

  return center;
};

/**
 * Gets the normal of the mesh
 * @param {Object} object The mesh
 * @returns the normal of the mesh
 */
export const getNormal = (object) => {
  const normal = new THREE.Vector3();

  if (object.name.startsWith("Screw")) {
    normal.set(0, 1, 0).applyQuaternion(object.quaternion);
  } else {
    normal.set(0, 0, 1).applyQuaternion(object.quaternion);
  }

  return normal;
};

export const negative = (num) => {
  return Math.sign(num) > 0 ? -num : -num;
};

export const negativeVector = (vector) => {
  return {
    x: negative(vector.x),
    y: negative(vector.y),
    z: negative(vector.z),
  };
};
