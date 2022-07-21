import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTemporaryComments, removeComment } from "../../features/comments/commentsSlice";
import { getObjects, addObjectToRemove } from "../../features/objects/objectsSlice";
import { getScene, getSceneModified, setSelectedMesh } from "../../features/scene/sceneSlice";
import { findById } from "../../utils/common-utils";
import ModalDelete from "../Modal/ModalDelete";
import PanelItem from "../PanelItem/PanelItem";

export default function Panel({ type }) {
  const scene = useSelector(getScene);
  const isModified = useSelector(getSceneModified);
  const objects = useSelector(getObjects);
  const temporaryComments = useSelector(getTemporaryComments);
  const dispatch = useDispatch();

  const [meshList, setMeshList] = useState([]);
  const [planeList, setPlaneList] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [measureList, setMeasureList] = useState([]);
  const [screwList, setScrewList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteElem, setDeleteElem] = useState();

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
        } else if (obj.name.startsWith("Screw")) {
          addMeshToList(screwList, obj, setScrewList);
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
    setScrewList(screwList.filter((mesh) => mesh.uuid !== id));

    // When the first element is deleted the selection go to the second, this is a workaround, pass a not existing id
    // no one mesh is selected
    dispatch(setSelectedMesh("1"));

    const mesh = findById(id)(scene.children);

    if (mesh.parent.name === "Import") {
      mesh.parent.remove(mesh);
    } else if (mesh.name.startsWith("Measure")) {
      document.getElementById(mesh.name).remove();
      scene.remove(mesh);
    } else if (mesh.name.startsWith("Plane") || mesh.name.startsWith("Comment") || mesh.name.startsWith("Screw")) {
      document.getElementById(mesh.name) && document.getElementById(mesh.name).remove();
      tControls.detach();
      scene.remove(mesh);

      // remove the comments from the temporary comments when the user remove a Point
      if (mesh.name.startsWith("Comment")) {
        const commentsToRemove = temporaryComments.filter((comment) => comment.pointId === mesh.uuid);
        for (const comment of commentsToRemove) {
          dispatch(removeComment(comment));
        }
      }
    }

    // if the object is in the the list of saved object, remove it otherwise remove it from the scene
    if (objects.length > 0) {
      // checks children of the measure object, the measure is a group
      if (mesh.children.length > 0) {
        for (const childMesh of mesh.children) {
          const object = objects.find((item) => item.id === childMesh.uuid);
          object !== undefined && dispatch(addObjectToRemove(object));
        }
      }

      const object = objects.find((item) => item.id === id);
      object !== undefined && dispatch(addObjectToRemove(object));
    }

    setIsOpen(false);
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
        ) : type === "measure" ? (
          <div id="measure" className="">
            {measureList.length > 0 &&
              measureList.map((mesh, i) => <PanelItem key={i} name={mesh.name} uuid={mesh.uuid} deleteClick={handleDelete} type="measure" />)}
          </div>
        ) : (
          type === "screw" && (
            <div id="screw" className="">
              {screwList.length > 0 &&
                screwList.map((mesh, i) => <PanelItem key={i} name={mesh.name} uuid={mesh.uuid} deleteClick={handleDelete} type="screw" />)}
            </div>
          )
        )}
      </div>
      <ModalDelete open={isOpen} onClose={() => setIsOpen(false)} onClick={deleteClick} />
    </>
  );
}

Panel.propTypes = {
  type: PropTypes.string.isRequired,
};
