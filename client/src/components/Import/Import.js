import React, { useState } from "react";
import importIcon from "../../assets/images/icons/white/download-solid.svg";
import Alert from "../Alert/Alert";
import PanelInfo from "../Panel/PanelInfo/PanelInfo";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { useDispatch, useSelector } from "react-redux";
import { getGroup, getSceneModified, setSceneModified } from "../../features/scene/sceneSlice";
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from "three-mesh-bvh";
import { getCenter } from "../../utils/functions/objectCalc";

export default function Import() {
  THREE.Mesh.prototype.raycast = acceleratedRaycast;
  THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
  THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

  const [error, setError] = useState(false);
  const [isFirstImport, setIsFirstImport] = useState(true);
  const [position, setPosition] = useState();

  const isModified = useSelector(getSceneModified);
  const group = useSelector(getGroup);
  const dispatch = useDispatch();

  const handleChange = async (e) => {
    const files = e.target.files;

    if (files.length > 0) {
      let firstPosition;
      for (var i = 0; i < files.length; i++) {
        if (files[i].name.split(".").pop() === "stl") {
          let modified = modified ? !modified : isModified;

          const contents = await loadFile(files[i]);
          const mesh = createMeshFromFile(files[i].name, contents);

          if (i === 0 && isFirstImport) {
            firstPosition = getCenter(mesh);
            setPosition(firstPosition);
            setIsFirstImport(false);
          }

          addPositionToMesh(mesh, position ? position : firstPosition);
          dispatch(setSceneModified(!modified));
        } else {
          setError(true);
        }
      }
    }
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
    mesh.name = filename;

    console.log(mesh);

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
