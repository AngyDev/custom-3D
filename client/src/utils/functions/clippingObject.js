import * as THREE from "three";

/**
 * Creates a clipping object
 * @param {THREE.BufferGeometry} geometry The geometry of the mesh
 * @param {THREE.Plane} plane The plane to clip the mesh
 * @param {THREE.Vector3} positionVector The vector to position the mesh
 * @param {Number} renderOrder The render order of the mesh
 * @returns THREE.Group of meshes
 */
export const createPlaneStencilGroup = (geometry, plane, positionVector, renderOrder) => {
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
  group.name = "planeStencilGroup";

  return group;
};

/**
 * Adds the color to the clipped mesh
 * @param {THREE.Scene} scene The scene to add the mesh to
 * @param {THREE.Group} group The group to add the mesh to
 * @param {THREE.Vector} positionVector The vector to position the mesh
 * @param {THREE.Plane} planesNegated The list of the negated planes
 * @param {THREE.Plane} planes The list of the planes
 */
export const addColorToClippedMesh = (scene, group, positionVector, planesNegated, planes) => {
  let planeObjects = [];
  let object = new THREE.Group();
  object.name = "ClippingGroup";
  scene.add(object);

  group.children.map((mesh) => {
    let geometry = mesh.geometry;

    for (let i = 0; i < planesNegated.length; i++) {
      const planeObj = planesNegated[i];
      const stencilGroup = createPlaneStencilGroup(geometry, planeObj, positionVector, i + 1);
      object.add(stencilGroup);
    }

    mesh.material.clippingPlanes = planesNegated;
  });

  // Set up clip plane rendering
  const planeGeom = new THREE.PlaneGeometry(1000, 1000);

  for (let i = 0; i < planesNegated.length; i++) {
    const poGroup = new THREE.Group();
    poGroup.name = "ClippingPlaneGroup";
    const plane = planes[i];
    // plane is clipped by the other clipping planes
    const planeMat = new THREE.MeshStandardMaterial({
      color: "#DE7630",
      metalness: 0.1,
      roughness: 0.75,
      clippingPlanes: planes.filter((p) => p !== plane),
      side: THREE.DoubleSide,

      stencilWrite: true,
      stencilRef: 0,
      stencilFunc: THREE.NotEqualStencilFunc,
      stencilFail: THREE.ReplaceStencilOp,
      stencilZFail: THREE.ReplaceStencilOp,
      stencilZPass: THREE.ReplaceStencilOp,
    });
    const po = new THREE.Mesh(planeGeom, planeMat);

    po.onAfterRender = function (renderer) {
      renderer.clearStencil();
    };

    po.renderOrder = i + 1.1;
    po.name = "plane" + i;

    poGroup.add(po);
    planeObjects.push(po);
    scene.add(poGroup);
  }

  for (let i = 0; i < planeObjects.length; i++) {
    const plane = planesNegated[i];
    const po = planeObjects[i];
    plane.coplanarPoint(po.position);
    po.lookAt(po.position.x - plane.normal.x, po.position.y - plane.normal.y, po.position.z - plane.normal.z);
  }
};
