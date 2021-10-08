import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getScene } from '../../features/scene/sceneSlice';

export default function PanelItem(props) {

    const scene = useSelector(getScene);
    const tControls = scene.children && scene.children.find((obj) => obj.name === "TransformControls");

    /**
     * Adds onclick a visible/unvisible functionality
     * @param {Event} e 
     */
    const handleClick = (e) => {
        e.target.classList.toggle("active");

        const name = e.target.nextSibling.data;

        scene.children.forEach((object) => {
            if (object.type === "Group") {
                object.children.forEach((item) => {

                    if (item.name === name) {
                        item.visible = !item.visible;
                    }
                });
            } else if (object.type === 'Mesh') {
                if (object.name === name) {
                    object.visible = !object.visible;
                }
            }
        })
    }

    const transformPlane = (e, mode) => {
        const name = e.target.attributes.name.nodeValue;

        scene.children.forEach((object) => {
            if (object.name === name) {
                tControls.attach(object);
                tControls.setMode(mode);
            }
        })
    }

    return (
        <>
            <div className="option flex">
                <span className="visible" onClick={handleClick}></span>
                {props.name}
                {
                    props.type === "planes" && <><span id={props.uuid} name={props.name} className="translate" onClick={(e) => transformPlane(e, "translate")}></span><span id={props.uuid} name={props.name} className="rotate" onClick={(e) => transformPlane(e, "rotate")}></span><span id={props.uuid} name={props.name} className="scale" onClick={(e) => transformPlane(e, "scale")}></span></>
                }
                <span id={props.uuid} name={props.name} className="delete" onClick={props.deleteClick}></span>
            </div>
        </>
    )
}
