import React, { useState } from "react";
import importIcon from "../../assets/images/icons/white/download-solid.svg";
import Alert from "../atoms/Alert/Alert";
import PanelInfo from "../Panel/PanelInfo/PanelInfo";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { useDispatch, useSelector } from "react-redux";
import { getGroup, getPositionVector, getSceneModified, setPositionVector, setSceneModified } from "../../features/scene/sceneSlice";
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from "three-mesh-bvh";
import { getCenter } from "../../utils/functions/objectCalc";

/**
 * The Import component takes user-imported files, converts them
 * to 3D objects, and passes them to the 3D scene for display.
 * @returns Import button
 */
export default function Import() {
  THREE.Mesh.prototype.raycast = acceleratedRaycast;
  THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
  THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

  const [error, setError] = useState(false);
  const [isFirstImport, setIsFirstImport] = useState(true);
  const [position, setPosition] = useState();

  const isModified = useSelector(getSceneModified);
  const group = useSelector(getGroup);
  const positionVector = useSelector(getPositionVector);
  const dispatch = useDispatch();

  /**
   * Gets the files from the input, loads the files and gets the contents to convert in threejs mesh
   * Saves the position of the first object and applies it to the next objects to maintain the original
   * position relative to the other objects.
   * @param {Event} e Files from the input
   */
  const handleChange = async (e) => {
    const files = e.target.files;

    if (files.length > 0) {
      // If an object is saved, the position of the imported object is set to the center of the saved object
      let firstPosition = Object.keys(positionVector).length !== 0 ? positionVector : null;

      for (var i = 0; i < files.length; i++) {
        if (files[i].name.split(".").pop() === "stl") {
          let modified = modified ? !modified : isModified;

          const contents = await loadFile(files[i]);
          const mesh = createMeshFromFile(files[i].name, contents);

          if (i === 0 && isFirstImport && firstPosition === null) {
            firstPosition = getCenter(mesh);
            setPosition(firstPosition);
            setIsFirstImport(false);
            dispatch(setPositionVector(firstPosition));
          }

          addPositionToMesh(mesh, position ? position : firstPosition);
          dispatch(setSceneModified(!modified));
        } else {
          setError(true);
        }
      }
    }
    e.target.value = null;
  };

  const loadFile = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        resolve(contents);
      };
      reader.readAsArrayBuffer(file);
    });

  const createMeshFromFile = (filename, contents) => {
    const geometry = new STLLoader().parse(contents);
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      // color: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
      color: "#C7AC96",
      side: THREE.DoubleSide,
      vertexColors: true,
    });

    const colorArray = new Uint8Array(geometry.attributes.position.count * 3);
    colorArray.fill(255);
    const colorAttr = new THREE.BufferAttribute(colorArray, 3, true);
    colorAttr.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("color", colorAttr);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Group" + filename.slice(0, -4);

    return mesh;
  };

  const addPositionToMesh = (mesh, position) => {
    mesh.position.set(-position.x, -position.y, -position.z);
    mesh.geometry.computeBoundsTree();
    mesh.renderOrder = 6;
    group.add(mesh);
  };

  return (
    <>
      <div>
        <label htmlFor="input_import" className="btn btn__icon">
          <img className="w-4 h-4 icon" src={importIcon} alt="Import" />
        </label>
        <input type="file" multiple id="input_import" accept=".stl" onChange={handleChange} />
      </div>
      {error && <Alert open={error} onClose={() => setError(false)} text="Import only STL file" />}
      <PanelInfo />
    </>
  );
}
