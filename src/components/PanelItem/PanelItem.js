import React from 'react';
import { useSelector } from 'react-redux';
import { selectScene } from '../../features/scene/sceneSlice';

export default function PanelItem(props) {

    const scene = useSelector(selectScene);

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
            }
        })
    }

    return (
        <div className="option flex">
            <span className="visible" onClick={handleClick}></span>
            {props.name}
            <span name={props.name} className="delete">
            </span>
        </div>
    )
}
