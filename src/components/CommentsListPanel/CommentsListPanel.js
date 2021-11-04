import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCanvas, getGroup, getScene, getSceneModified, setSceneModified } from '../../features/scene/sceneSlice';
import Button from "../Button/Button";
import * as THREE from "three";
import { useForm } from 'react-hook-form';
import Panel from '../Panel/Panel';
import { useDispatch } from 'react-redux';

import Comments from '../Comments/Comments';
import { getSidebarWidth } from '../../features/dimensions/dimensionsSlice';
import { getHeaderHeight } from '../../features/dimensions/dimensionsSlice';
import { getIsTextOpen } from '../../features/comments/commentsSlice';

export default function CommentsListPanel() {

    const { handleSubmit, register, reset, formState: { errors } } = useForm();

    const [openText, setOpenText] = useState(false);
    const [counter, setCounter] = useState(1);
    const [showComment, setShowComment] = useState(false);
    const [comments, setComments] = useState([]);

    const scene = useSelector(getScene);
    const group = useSelector(getGroup);
    const canvas = useSelector(getCanvas);
    const isModified = useSelector(getSceneModified);
    //const isTextOpen = useSelector(getIsTextOpen);

    const dispatch = useDispatch();
    const camera = scene.children && scene.children.find((children) => children.type === "PerspectiveCamera");
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const sidebarWidth = useSelector(getSidebarWidth);
    const headerHeight = useSelector(getHeaderHeight);

    // Dispatch the resize event to recalculate the width of the canvas when the bar is open and close (return)
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));

        return () => {
            canvas.removeEventListener('dblclick', onPointerClick);
            window.dispatchEvent(new Event('resize'));
        }
    });


    useEffect(() => {
        setOpenText(isTextOpen);
    }, [isTextOpen])

    const addPoint = () => {
      
        canvas.addEventListener('dblclick', onPointerClick);
    }

    /**
     * Double Click event, the function creates a point when the user clicks on the mesh
     * @param {Event} event 
     */
    const onPointerClick = (event) => {

        pointer.x = ((event.clientX - sidebarWidth) / canvas.offsetWidth) * 2 - 1;
        pointer.y = - ((event.clientY - headerHeight) / canvas.offsetHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);

        // See if the ray from the camera into the world hits one of our meshes
        const intersects = raycaster.intersectObjects(group.children, true);

        // Creates a point
        const geometry = new THREE.SphereGeometry(0.5, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sphere = new THREE.Mesh(geometry, material);

        console.log(intersects);
        if (intersects.length > 0) {
            sphere.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
            sphere.name = 'Point' + counter;
            scene.add(sphere);

            setCounter(counter => counter + 1);
            setOpenText(true);

            dispatch(setSceneModified(!isModified));
        }
    }

    const saveComment = (data) => {
        // after the save on the DB show the comment in the panel
        setShowComment(true);
        const userComment = {
            user_name: "Angela Busato",
            text: data.comment
        }
        setComments((prev) => [...prev, userComment]);
    }

    return (
        <div className="comments">
            <h3>Comments</h3>
            <div className="sidebar__buttons">
                <Button typeClass="btn--size" text="ADD POINT" onClick={addPoint} />
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
            {
                showComment &&
                <Comments data={comments} />
            }
        </div>
    )
}