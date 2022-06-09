import * as THREE from "three";

export const getCenter = (object) => {
  const center = new THREE.Vector3();

  const box3 = new THREE.Box3().setFromObject(object);
  box3.getCenter(center);

  return center;
};

export const getNormal = (object) => {
  const normal = new THREE.Vector3();
  normal.set(0, 0, 1).applyQuaternion(object.quaternion);

  return normal;
};

export const negative = (num) => {
  return Math.sign(num) > 0 ? (num = -num) : num;
};

export const negativeVector = (vector) => {
  return {
    x: negative(vector.x),
    y: negative(vector.y),
    z: negative(vector.z),
  };
};
