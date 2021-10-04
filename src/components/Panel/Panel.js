import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectScene } from '../../features/scene/sceneSlice';
import PanelItem from '../PanelItem/PanelItem';

export default function Panel() {

    const scene = useSelector(selectScene);
    const [groupObject, setGroupObject] = useState([]);
    const [meshList, setMeshList] = useState([]);

    useEffect(() => {
        if (scene.children) {
            scene.children.map((obj, i) => {
                if (obj.type === "Group") {
                    // setGroupObject([obj]);
                    obj.children.map((mesh) => {
                        if (meshList.length > 0) {
                            if (!containMesh(meshList, mesh)) {
                                setMeshList((prev) => [...prev, mesh])
                            }
                        } else {
                            setMeshList((prev) => [...prev, mesh])
                        }
                    })
                }
            })
        }
    }, [scene])

    const containMesh = (list, mesh) => {
        return list.some((item) => item.uuid === mesh.uuid);
    }

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
            <div id="scene" className="">
                {
                    meshList.length > 0 && meshList.map((mesh, i) => <PanelItem key={i} name={mesh.name} uuid={mesh.uuid} deleteClick={deleteClick} />)

                    // groupObject.length > 0 && groupObject[0].children && console.log(groupObject[0].children) 
                    // scene.children && scene.children.map((obj, i) => obj.type === "Group" && obj.children.map((mesh, i) => <PanelItem key={i} name={mesh.name} uuid={mesh.uuid} deleteClick={deleteClick}/>))
                    // groupObject.length > 1 && groupObject[0].children.map((mesh, i) => <PanelItem key={i} name={mesh.name} uuid={mesh.uuid} />)

                    // groupObject.length > 0 && groupObject[0].children && groupObject[0].children.map((mesh, i) => <PanelItem key={i} name={mesh.name} uuid={mesh.uuid} deleteClick={deleteClick}/>)
                }
            </div>
        </div>
    )
}
