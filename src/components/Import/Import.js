import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectScene } from '../../features/scene/sceneSlice';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from "three";

export default function Import() {

    const scene = useSelector(selectScene);
    const vector = new THREE.Vector3();
    var isFirstImport = true;

    const handleChange = (e) => {
        const files = e.target.files;

        importFile(files);
    }

    const importFile = (files) => {
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                loadFile(files[i]);
            }
        }
    }

    const loadFile = (file) => {
        const filename = file.name;
        const reader = new FileReader();

        reader.addEventListener('load', (event) => {
            const contents = event.target.result;

            const mesh = createMeshFromFile(filename, contents);

            //sidebar.buildOption(this.scene, mesh);
            isFirstImport && setFirstObjPosition(mesh);

            const group = scene.children.find((obj) => obj.type === "Group");

            mesh.geometry.translate(-vector.x, -vector.y, -vector.z);

            group.add(mesh);
            //scene.add(mesh);

        }, false);

        reader.readAsArrayBuffer(file);
    }

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

        const material = new THREE.MeshStandardMaterial({ color: "#" + (((1 << 24) * Math.random()) | 0).toString(16) });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = filename;

        return mesh;
    }

    /**
     * Sets the position of the first object of the group
     */
    const setFirstObjPosition = (mesh) => {
        const box3 = new THREE.Box3().setFromObject(mesh);
        box3.getCenter(vector);

        isFirstImport = false;
    }

    return (
        <div>
            <label htmlFor="input_import" className="btn">
                Import
            </label>
            <input type="file" multiple id="input_import" accept=".stl" onChange={handleChange} />
        </div>
    )
}
