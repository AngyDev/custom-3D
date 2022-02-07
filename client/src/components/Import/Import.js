import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setSceneModified, getChildrens, getGroup, getSceneModified, getScene } from "../../features/scene/sceneSlice";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import { useDispatch } from "react-redux";

export default function Import() {
  const scene = useSelector(getScene);
  const group = useSelector(getGroup);
  const isModified = useSelector(getSceneModified);
  const dispatch = useDispatch();

  const [mesh, setMesh] = useState();
  const [vector, setVector] = useState(new THREE.Vector3());
  const [isFirstImport, setIsFirstImport] = useState(true);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (mesh !== undefined) {
      // If it is the first file, calculates the position of the mesh otherwise create a group of mesh
      if (isFirstImport) {
        setFirstObjPosition(mesh);
      } else {
        addMeshToGroup(mesh);
      }
    }
  }, [mesh, vector]);

  useEffect(() => {
    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        loadFile(files[i]);
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
  const loadFile = (file) => {
    const filename = file.name;
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      (event) => {
        const contents = event.target.result;

        setMesh(createMeshFromFile(filename, contents));
      },
      false
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
      color: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = filename;

    return mesh;
  };

  /**
   * Adds the mesh to the group
   * @param {Mesh} mesh THREE.Mesh
   */
  const addMeshToGroup = (mesh) => {
    group.add(mesh);

    setGroupPosition();
  };

  /**
   * Sets group position
   */
  const setGroupPosition = () => {
    group.position.set(-vector.x, -vector.y, -vector.z);

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
    setIsFirstImport(false);

    addMeshToGroup(mesh);
  };

  return (
    <div>
      <label htmlFor="input_import" className="btn">
        Import
      </label>
      <input type="file" multiple id="input_import" accept=".stl" onChange={handleChange} />
    </div>
  );
}
