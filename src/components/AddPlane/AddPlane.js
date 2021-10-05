import React, { useState } from 'react';
import Button from "../Button/Button";
import * as THREE from "three";
import { useSelector } from 'react-redux';
import { getScene } from '../../features/scene/sceneSlice';

export default function AddPlane() {

    const [counter, setCounter] = useState(1);
    const scene = useSelector(getScene);

    /**
     * Adds plane to the scene
     */
    const addPlane = () => {

        const plane = createPlane();
        scene.add(plane);
    }
    
    const createPlane = () => {
        var geometry = new THREE.PlaneGeometry(50, 50, 1, 1);
        var material = new THREE.MeshStandardMaterial({ color: "#38382f", side: THREE.DoubleSide});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'Plane' + counter;
        
        setCounter(counter => counter + 1);
        
        return mesh;
    }

    return (
        <Button typeClass="btn--size" text="ADD PLANE" onClick={addPlane} />
    )
}
