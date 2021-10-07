import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isModified, getGroup, getSceneModified, getScene } from '../../features/scene/sceneSlice';
import PanelItem from '../PanelItem/PanelItem';

export default function Panel(props) {

    const scene = useSelector(getScene);
    const [meshList, setMeshList] = useState([]);
    const [planeList, setPlaneList] = useState([]);

    const group = useSelector(getGroup);
    const isModified = useSelector(getSceneModified);

    useEffect(() => {
        if (scene.children) {
            scene.children.map((obj, i) => {
                if (obj.type === "Group") {
                    obj.children.map((mesh) => {
                        if (meshList.length > 0) {
                            if (!containMesh(meshList, mesh)) {
                                setMeshList((prev) => [...prev, mesh]);
                            }
                        } else {
                            setMeshList((prev) => [...prev, mesh]);
                        }
                    })
                } else if (obj.type === "Mesh") {
                    if (planeList.length > 0) {
                        if (!containMesh(planeList, obj)) {
                            setPlaneList((prev) => [...prev, obj]);
                        }
                    } else {
                        setPlaneList((prev) => [...prev, obj]);
                    }
                }
            })
        }
    }, [isModified])

    /**
     * Checks if the mesh is in the list
     * @param {Array} list List of meshes
     * @param {Mesh} mesh THREE.Mesh
     * @returns 
     */
    const containMesh = (list, mesh) => {
        return list.some((item) => item.uuid === mesh.uuid);
    }

    /**
     * Deletes the object from HTML and scene 
     * @param {Event} e 
     */
    const deleteClick = (e) => {
        const name = e.target.attributes.name.nodeValue;
        const id = e.target.attributes.id.nodeValue;
        const parent = e.target.parentNode;

        setMeshList(meshList.filter(mesh => mesh.uuid !== id));

        scene.children.forEach((object) => {
            if (object.type === 'Group') {
                object.children.forEach((item) => {
                    if (item.uuid === id) {
                        object.remove(item);
                    }
                });
            }
        })
    }

    return (
        <div className="panel">
            {
                props.type === "scene"
                    ?
                    <div id="scene" className="">
                        {
                            meshList.length > 0 && meshList.map((mesh, i) => <PanelItem key={i} name={mesh.name} uuid={mesh.uuid} deleteClick={deleteClick} />)
                        }
                    </div>
                    :
                    <div id="planes" className="">
                        {
                            planeList.length > 0 && planeList.map((obj, i) => <p key={i}>{obj.name}</p>)
                        }
                    </div>
            }
        </div>
    )
}
