import React, { useEffect } from 'react';
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

    // const deleteClick = (e) => {
    //     const name = e.target.attributes.name.nodeValue;
    //     const parent = e.target.parentNode;

    //     console.log(name);
    //     console.log(parent);

    //     if (confirm(`Are you sure you want to delete ${name}?`)) {
    //         // Delete the element
    //         scene.children.forEach((object) => {
    //             if (object.type === 'Group') {
    //                 object.children.forEach((item) => {

    //                     // if (item.name === name) {

    //                     //     parent.remove();
    //                     //     object.remove(item);
    //                     // }
    //                     if (item.uuid === name) {

    //                         parent.remove();
    //                         object.remove(item);
    //                     }
    //                 });
    //             }
    //         })
    //     }
    // }

    return (
        <>
        <div className="option flex">
            <span className="visible" onClick={handleClick}></span>
            {props.name}
            <span id={props.uuid} name={props.name} className="delete" onClick={props.deleteClick}>
            </span>
        </div>
        </>
    )
}
