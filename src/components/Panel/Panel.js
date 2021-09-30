import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectScene } from '../../features/scene/sceneSlice';

export default function Panel() {

    const scene = useSelector(selectScene);

    return (
        <div className="panel">
            <div id="scene" className="">
                {
                    scene.children && scene.children.map((obj, i) => obj.type === "Group" && obj.children.map((mesh, i) => <p key={i}>{mesh.name}</p>))
                }
            </div>
        </div>
    )
}
