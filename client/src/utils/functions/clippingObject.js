import * as THREE from "three";

/**
 * Creates a clipping object
 * @param {THREE.BufferGeometry} geometry The geometry of the mesh
 * @param {THREE.Plane} plane The plane to clip the mesh
 * @param {THREE.Vector3} positionVector The vector to position the mesh
 * @param {Number} renderOrder The render order of the mesh
 * @returns THREE.Group of meshes
 */
export const createPlaneStencilGroup = (name, geometry, plane, positionVector, renderOrder) => {
  const group = new THREE.Group();
  const baseMat = new THREE.MeshBasicMaterial();
  baseMat.depthWrite = false;
  baseMat.depthTest = false;
  baseMat.colorWrite = false;
  baseMat.stencilWrite = true;
  baseMat.stencilFunc = THREE.AlwaysStencilFunc;

  // back faces
  const mat0 = baseMat.clone();
  mat0.side = THREE.BackSide;
  mat0.clippingPlanes = [plane];
  mat0.stencilFail = THREE.IncrementWrapStencilOp;
  mat0.stencilZFail = THREE.IncrementWrapStencilOp;
  mat0.stencilZPass = THREE.IncrementWrapStencilOp;

  const mesh0 = new THREE.Mesh(geometry, mat0);
  mesh0.name = "back";
  mesh0.renderOrder = renderOrder;
  mesh0.position.set(-positionVector.x, -positionVector.y, -positionVector.z);

  group.add(mesh0);

  // front faces
  const mat1 = baseMat.clone();
  mat1.side = THREE.FrontSide;
  mat1.clippingPlanes = [plane];
  mat1.stencilFail = THREE.DecrementWrapStencilOp;
  mat1.stencilZFail = THREE.DecrementWrapStencilOp;
  mat1.stencilZPass = THREE.DecrementWrapStencilOp;

  const mesh1 = new THREE.Mesh(geometry, mat1);
  mesh1.name = "front";
  mesh1.renderOrder = renderOrder;
  mesh1.position.set(-positionVector.x, -positionVector.y, -positionVector.z);

  group.add(mesh1);
  group.name = "planeStencilGroup" + name;

  return group;
};

/**
 * Adds the color to the clipped mesh
 * @param {THREE.Scene} scene The scene to add the mesh to
 * @param {THREE.Group} group The group to add the mesh to
 * @param {THREE.Vector} positionVector The vector to position the mesh
 * @param {THREE.Plane} planesNegated The list of the negated planes
 * @param {THREE.Plane} planes The list of the planes
 * @param {Boolean} clipIntersection The value of the property to set on the colored planes
 */
export const addColorToClippedMesh = (scene, group, positionVector, planesNegated, planes, clipIntersection) => {
  let object = new THREE.Group();
  object.name = "ClippingGroup";
  scene.add(object);

  let y = 0;

  group.children.map((mesh) => {
    let geometry = mesh.geometry;

    for (let i = 0; i < planesNegated.length; i++) {
      const planeObj = planesNegated[i];
      const stencilGroup = createPlaneStencilGroup(mesh.name, geometry, planeObj, positionVector, y);
      object.add(stencilGroup);

      const cap = createPlaneColored(planes, planeObj, mesh.material.color, y + 0.1, clipIntersection);
      cap.name = "Clipping" + mesh.name;
      scene.add(cap);

      planeObj.coplanarPoint(cap.position);
      cap.lookAt(cap.position.x - planeObj.normal.x, cap.position.y - planeObj.normal.y, cap.position.z - planeObj.normal.z);
      y++;
    }

    mesh.material.clippingPlanes = planesNegated;
  });
};

/**
 * Creates the colored planes for the clipping
 * @param {Array} planes The list of planes used for the clipping
 * @param {THREE.Plane} plane Plane to create
 * @param {String} color Color of the mesh
 * @param {Number} renderOrder The order to render the plane
 * @param {Boolean} clipIntersection
 * @returns
 */
const createPlaneColored = (planes, plane, color, renderOrder, clipIntersection) => {
  const capMat = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.1,
    roughness: 0.75,
    clipIntersection: clipIntersection,
    clippingPlanes: planes.filter((p) => p !== plane),
    side: THREE.DoubleSide,
    stencilWrite: true,
    stencilRef: 0,
    stencilFunc: THREE.NotEqualStencilFunc,
    stencilFail: THREE.ReplaceStencilOp,
    stencilZFail: THREE.ReplaceStencilOp,
    stencilZPass: THREE.ReplaceStencilOp,
  });
  const cap = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), capMat);
  // clear the stencil buffer
  cap.onAfterRender = function (renderer) {
    renderer.clearStencil();
  };

  cap.renderOrder = renderOrder;
  return cap;
};
