import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCanvas, getGroup, getScene, getSceneModified, setSceneModified } from '../../features/scene/sceneSlice';
import Button from "../Button/Button";
import * as THREE from "three";
import { useForm } from 'react-hook-form';
import Panel from '../Panel/Panel';
import { useDispatch } from 'react-redux';

export default function CommentsListPanel() {

    const { handleSubmit, register, reset, formState: { errors } } = useForm();

    const [openText, setOpenText] = useState(false);
    const [counter, setCounter] = useState(1);
    const scene = useSelector(getScene);
    const group = useSelector(getGroup);
    const canvas = useSelector(getCanvas);
    const isModified = useSelector(getSceneModified);
    const dispatch = useDispatch();
    const camera = scene.children && scene.children.find((children) => children.type === "PerspectiveCamera");
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // Dispatch the resize event to recalculate the width of the canvas when the bar is open and close (return)
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));

        return () => {
            canvas.removeEventListener('dblclick', onPointerClick);
            window.dispatchEvent(new Event('resize'));
        }
    });

    const handleClick = () => {

        canvas.addEventListener('dblclick', onPointerClick);

        // const geometry = new THREE.BoxGeometry(10, 10, 10);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // const cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);
    }

    /**
     * Double Click event, the function creates a point when the user clicks on the mesh
     * @param {Event} event 
     */
    const onPointerClick = (event) => {

        pointer.x = (event.clientX / canvas.offsetWidth) * 2 - 1;
        pointer.y = - (event.clientY / canvas.offsetHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);

        // See if the ray from the camera into the world hits one of our meshes
        const intersects = raycaster.intersectObjects(group.children, true);

        // Creates a point
        const geometry = new THREE.SphereGeometry(0.5, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sphere = new THREE.Mesh(geometry, material);

        console.log(intersects);
        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {

                //intersects[ i ].object.material.color.set( 0xff0000 );
                sphere.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                sphere.name = 'Point' + counter;
                scene.add(sphere);

                setCounter(counter => counter + 1);
                setOpenText(true);

                dispatch(setSceneModified(!isModified));
            }
        }
    }

    const saveComment = (data) => {
        console.log(data);
    }

    return (
        <div className="comments">
            <h3>Comments</h3>
            <div className="sidebar__buttons">
                <Button typeClass="btn--size" text="ADD POINT" onClick={handleClick} />
            </div>
            <div className="comments__panel">
                <h3>Points on the mesh</h3>
                <Panel type="points" />
            </div>
            {
                openText &&
                <form className="comments__text flex flex-col" onSubmit={handleSubmit(saveComment)}>
                    <div>
                        <label htmlFor="comment">Add Comment</label>
                        <textarea name="comment" id="comment" cols="30" rows="5" {...register("comment")} />
                    </div>
                    <div className="flex justify-between comments__btn">
                        <Button typeClass="btn--size" text="SAVE" />
                        <input className="btn btn--size" type="reset" value="RESET" />
                    </div>
                </form>
            }
        </div>
    )
}
