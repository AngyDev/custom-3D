import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getScene, getSceneModified, setSelectedMesh } from "../../features/scene/sceneSlice";
import { deleteObject } from "../../utils/api";
import { findById } from "../../utils/common-utils";
import ModalDelete from "../Modal/ModalDelete";
import PanelItem from "../PanelItem/PanelItem";

export default function Panel({ type }) {
  const scene = useSelector(getScene);
  const [meshList, setMeshList] = useState([]);
  const [planeList, setPlaneList] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [measureList, setMeasureList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteElem, setDeleteElem] = useState();

  const isModified = useSelector(getSceneModified);
  const dispatch = useDispatch();

  const tControls = scene.children && scene.children.find((obj) => obj.name === "TransformControls");

  useEffect(() => {
    setMeshList(meshList.filter((mesh) => mesh.parent !== null));
    if (scene.children) {
      scene.children.map((obj) => {
        if (obj.type === "Group" && obj.name === "Import") {
          obj.children.map((mesh) => {
            addMeshToList(meshList, mesh, setMeshList);
          });
        } else if (obj.name.startsWith("Plane")) {
          addMeshToList(planeList, obj, setPlaneList);
        } else if (obj.name.startsWith("Comment")) {
          addMeshToList(pointList, obj, setPointList);
        } else if (obj.type === "Group" && obj.name.startsWith("Measure")) {
          addMeshToList(measureList, obj, setMeasureList);
        }
      });
    }
  }, [isModified]);

  /**
   * Checks if the mesh is in the list and if it is not add the mesh to the list
   * @param {Array} list List of meshes
   * @param {Mesh} mesh THREE.Mesh
   * @param {SetStateAction} saveState React state of list
   */
  const addMeshToList = (list, mesh, saveState) => {
    const isContainMesh = list.some((item) => item.uuid === mesh.uuid);

    if (list.length > 0) {
      if (!isContainMesh) {
        saveState((prev) => [...prev, mesh]);
      }
    } else {
      saveState((prev) => [...prev, mesh]);
    }
  };

  const handleDelete = (e) => {
    setDeleteElem(e);
    setIsOpen(true);
  };

  /**
   * Deletes the object from HTML and scene
   * @param {Event} e
   */
  const deleteClick = () => {
    const id = deleteElem.target.attributes.id.nodeValue;

    // removes the active class on visibility before delete the node
    deleteElem.target.parentNode.firstChild.classList.remove("active");

    setMeshList(meshList.filter((mesh) => mesh.uuid !== id));
    setPlaneList(planeList.filter((mesh) => mesh.uuid !== id));
    setPointList(pointList.filter((mesh) => mesh.uuid !== id));
    setMeasureList(measureList.filter((mesh) => mesh.uuid !== id));

    // When the first element is deleted the selection go to the second, this is a workaround, pass a not existing id
    // no one mesh is selected
    dispatch(setSelectedMesh(1));

    const mesh = findById(id)(scene.children);

    scene.children.forEach((object) => {
      if (object.type === "Group" && object.name === "Import") {
        object.children.forEach((item) => {
          if (item.uuid === id) {
            object.remove(item);
          }
        });
      } else if (object.type === "Mesh") {
        if (object.uuid === id) {
          // removes the label of the point
          document.getElementById(object.name) && document.getElementById(object.name).remove();
          scene.remove(object);
          tControls.detach();
        }
      } else if (object.type === "Group" && object.name.startsWith("Measure")) {
        if (object.uuid === id) {
          // removes the label of the measure
          document.getElementById(object.name).remove();
          scene.remove(object);
        }
      }
    });
    setIsOpen(false);

    console.log(mesh);
    const response = deleteObject(mesh.uuid);
    console.log(response);
  };

  return (
    <>
      <div className="panel rounded">
        {type === "scene" ? (
          <div id="scene" className="">
            {meshList.length > 0 &&
              meshList.map((mesh, i) => <PanelItem key={i} name={mesh.name} uuid={mesh.uuid} deleteClick={handleDelete} type="scene" />)}
          </div>
        ) : type === "planes" ? (
          <div id="planes" className="">
            {planeList.length > 0 &&
              planeList.map((mesh, i) => <PanelItem key={i} name={mesh.name} uuid={mesh.uuid} deleteClick={handleDelete} type="planes" />)}
          </div>
        ) : type === "points" ? (
          <div id="points" className="">
            {pointList.length > 0 &&
              pointList.map((mesh, i) => <PanelItem key={i} name={mesh.name} uuid={mesh.uuid} deleteClick={handleDelete} type="points" />)}
          </div>
        ) : (
          <div id="measure" className="">
            {measureList.length > 0 &&
              measureList.map((mesh, i) => <PanelItem key={i} name={mesh.name} uuid={mesh.uuid} deleteClick={handleDelete} type="measure" />)}
          </div>
        )}
      </div>
      {/* <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Delete Object" text="Delete">
        <div className="flex flex-col">
          <h3>Are you Sure?</h3>
          <div className="flex justify-end">
            <Button typeClass="btn--size" text="OK" onClick={deleteClick} />
          </div>
        </div>
      </Modal> */}
      <ModalDelete open={isOpen} onClose={() => setIsOpen(false)} onClick={deleteClick} />
    </>
  );
}

Panel.propTypes = {
  type: PropTypes.string.isRequired,
};
