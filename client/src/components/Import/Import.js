import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import importIcon from "../../assets/images/icons/download-solid.svg";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { getGroup, getSceneModified, setPositionVector, setSceneModified } from "../../features/scene/sceneSlice";
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from "three-mesh-bvh";

export default function Import() {
  THREE.Mesh.prototype.raycast = acceleratedRaycast;
  THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
  THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

  const group = useSelector(getGroup);
  const isModified = useSelector(getSceneModified);
  const dispatch = useDispatch();

  const [mesh, setMesh] = useState();
  const [vector, setVector] = useState();
  const [isFirstImport, setIsFirstImport] = useState(true);
  const [files, setFiles] = useState([]);

  const [imported, setImported] = useState(true);

  useEffect(() => {
    if (mesh !== undefined) {
      if (isFirstImport) {
        const position = setFirstObjPosition(mesh);
        addPositionToMesh(mesh, position);
      } else {
        addPositionToMesh(mesh);
      }
    }
  }, [imported]);

  useEffect(() => {
    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        loadFile(files[i], createMeshFromFile);
      }
    }
  }, [files]);

  const handleChange = (e) => {
    const files = e.target.files;

    setFiles(files);
  };

  /**
   * Loads the file and reads the content of the file
   * @param {File} file File imported
   */
  const loadFile = (file, createMeshFromFile) => {
    const filename = file.name;
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      (event) => {
        const contents = event.target.result;
        createMeshFromFile(filename, contents);
      },
      false,
    );

    reader.readAsArrayBuffer(file);
  };

  /**
   * Creates a mesh from file
   * @param {FileName} filename The name of the file
   * @param {FileReader} contents Result of FileReader
   * @returns mesh
   */
  const createMeshFromFile = (filename, contents) => {
    const geometry = new STLLoader().parse(contents);
    //geometry.center();
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
    setMesh(mesh);
    setImported((prev) => !prev);
  };

  /**
   * Adds the position to the mesh and adds the mesh to the group
   * @param {Object3D} mesh The mesh to be position
   * @param {Vector3} position The positino of the mesh
   */
  const addPositionToMesh = (mesh, position) => {
    if (vector === undefined) {
      mesh.position.set(-position.x, -position.y, -position.z);
    } else {
      mesh.position.set(-vector.x, -vector.y, -vector.z);
    }
    mesh.geometry.computeBoundsTree();
    group.add(mesh);
    dispatch(setSceneModified(!isModified));
  };

  /**
   * Sets the position of the first object of the group
   * @param {Mesh} mesh THREE.Mesh
   */
  const setFirstObjPosition = (mesh) => {
    const center = new THREE.Vector3();

    const box3 = new THREE.Box3().setFromObject(mesh);
    box3.getCenter(center);

    setVector(center);
    dispatch(setPositionVector(center));
    setIsFirstImport(false);

    return center;
  };

  return (
    <div>
      <label htmlFor="input_import" className="btn">
        <img className="w-4 h-4" src={importIcon} alt="Import" />
      </label>
      <input type="file" multiple id="input_import" accept=".stl" onChange={handleChange} />
    </div>
  );
}
