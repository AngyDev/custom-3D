import React from 'react';
import { useSelector } from 'react-redux';
import { selectScene } from '../../features/scene/sceneSlice';

export default function Panel() {

    const scene = useSelector(selectScene);

    return (
        <div className="panel">
            <div id="scene" className="">
                {
                    scene.children && scene.children.map((obj, i) => {
                        //return <p key={i}>{obj.type}</p>
                        if (obj.type === "Group") {
                            obj.children.map((mesh) => <p>mesh.name</p>);
                            //return <p key={i}>{obj}</p>
                        }
                    })
                }
            </div>
        </div>
    )
}
