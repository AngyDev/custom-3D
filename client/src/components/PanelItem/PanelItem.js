import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as THREE from "three";
import { getIsTextOpen, setIsTextOpen } from "../../features/comments/commentsSlice";
import { getGroup, getPositionVector, getScene, getSelectedMesh, setSelectedMesh } from "../../features/scene/sceneSlice";
import ChangeColor from "../ChangeColor/ChangeColor";
import Modal from "../Modal/Modal";
import Offset from "../Offset/Offset";
import { addColorToClippedMesh } from "../../utils/functions/clippingObject";
import { findById } from "../../utils/common-utils";
import PanelObjectInfo from "../Panel/PanelObjectInfo/PanelObjectInfo";
import ScaleScrew from "../ScaleScrew/ScaleScrew";

export default function PanelItem({ uuid, type, name, deleteClick }) {
  const scene = useSelector(getScene);
  const group = useSelector(getGroup);
  const selectedMesh = useSelector(getSelectedMesh);
  const positionVector = useSelector(getPositionVector);
  const isTextOpen = useSelector(getIsTextOpen);
  const tControls = scene.children && scene.children.find((obj) => obj.name === "TransformControls");
  const [selected, setSelected] = useState(false);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [plane] = useState(new THREE.Plane());
  const [clipped, setClipped] = useState(false);
  const [openOffset, setOpenOffset] = useState(false);
  const [openObjectInfo, setOpenObjectInfo] = useState(false);
  const [selectedObject, setSelectedObject] = useState();
  const [panelTopPosition, setPanelTopPosition] = useState();
  const [openScaleScrew, setOpenScaleScrew] = useState(false);
  const [meshToOffsetId, setMeshToOffsetId] = useState();
  const [screwId, setScrewId] = useState();

  useEffect(() => {
    // checks the selected mesh to add background to panel object
    if (uuid === selectedMesh) {
      setSelected(true);
    } else {
      setSelected(false);
    }
    // changes the color of the point
    // TODO: checks if it is the correct place for this function, every time the useEffect is called the function is called
    selectedPoints(selectedMesh);
  }, [selectedMesh]);

  /**
   * Adds onclick a visible/unvisible functionality
   * @param {Event} e
   */
  const handleClick = (e) => {
    dispatch(setSelectedMesh(e.target.id));
    e.target.classList.toggle("active");

    const id = e.target.id;

    // Get the mesh selected with the name
    const mesh = findById(id)(scene.children);

    mesh.visible = !mesh.visible;
    if (mesh.name.startsWith("Measure")) {
      for (const child of mesh.children) {
        // remove the label on the measurement
        child.children.length > 0 && (child.children[0].visible = !child.children[0].visible);
      }
    }

    if (mesh.name.startsWith("Plane") || mesh.name.startsWith("Comment") || mesh.name.startsWith("Screw")) {
      // if the mesh is a comment remove the label
      mesh.children.length > 0 && (mesh.children[0].visible = !mesh.children[0].visible);
      // remove the controls
      if (tControls.visible && selectedMesh === e.target.id) tControls.detach();
      //else tControls.attach();
    }
  };

  /**
   * Buttons to handle the transformation of the plane
   * @param {Event} e
   * @param {*} mode Transformation mode
   */
  const transformObject = (e, mode) => {
    const nodeId = e.target.attributes.id.nodeValue;
    const mesh = findById(nodeId)(scene.children);

    dispatch(setSelectedMesh(nodeId));

    // Checks created to control the transformControls to remove if present and add if not
    if (tControls.visible && tControls.mode === mode && selectedMesh === nodeId) {
      tControls.detach();
    } else {
      tControls.attach(mesh);
      tControls.setMode(mode);
    }
  };

  /**
   * Clipping the selected mesh
   * @param {Event} e
   */
  const clippingMesh = (e) => {
    setClipped((prev) => !prev);

    const planeUuid = e.target.attributes.id.nodeValue;
    dispatch(setSelectedMesh(planeUuid));

    const result = scene.children.filter((object) => object.name.startsWith("Clipping"));

    if (result.length === 0) {
      const planeMesh = scene.children.filter((item) => item.uuid === planeUuid)[0];

      // const plane = new THREE.Plane();
      const normal = new THREE.Vector3();
      const point = new THREE.Vector3();

      // Create a THREE.Plane from a THREE.PlaneGeometry
      normal.set(0, 0, 1).applyQuaternion(planeMesh.quaternion);
      point.copy(planeMesh.position);
      plane.setFromNormalAndCoplanarPoint(normal, point);

      let planes = [plane];

      addColorToClippedMesh(scene, group, positionVector, planes, planes);
    } else {
      scene.children
        .filter((object) => object.name.startsWith("Clipping"))
        .map((object) => {
          scene.remove(object);
        });

      group.children.map((mesh) => {
        mesh.material.clippingPlanes = [];
      });
    }
  };

  /**
   * Handles the negated clipping
   */
  const handleNegated = () => {
    plane.negate();
  };

  /**
   * Changes the color of the point
   * @param {String} uuid The uuid of the mesh
   */
  const selectedPoints = (uuid) => {
    scene.children.map((mesh) => {
      if (mesh.name.startsWith("Comment")) {
        if (mesh.uuid === uuid) {
          mesh.material.color.setHex(0xffff00); // yellow selected
        } else {
          mesh.material.color.setHex(0xff0000); // red not selected
        }
      }
    });
  };

  /**
   * Clicks on the point
   * @param {Event} e
   */
  const pointClick = (uuid) => {
    tControls.detach();
    selectedPoints(uuid);

    dispatch(setSelectedMesh(uuid));
    dispatch(setIsTextOpen(!isTextOpen));
  };

  /**
   * Set the selected mesh and opens the offset modal
   * @param {Event} e
   */
  const modalColorMesh = (e) => {
    dispatch(setSelectedMesh(e.target.id));
    setIsOpen(true);
  };

  /**
   * Changes the color of the selected mesh
   * @param {String} color The color to set the mesh
   */
  const changeColorMesh = (color) => {
    const mesh = findById(selectedMesh)(group.children);
    mesh.material.color.set(color);

    setIsOpen(false);
  };

  /**
   * Handles the offset of the mesh
   * @param {Event} e
   */
  const handleOffset = (e) => {
    dispatch(setSelectedMesh(e.target.id));
    setOpenOffset(!openOffset);
    setMeshToOffsetId(e.target.id);
  };

  const handleScaleObject = (e) => {
    dispatch(setSelectedMesh(e.target.id));
    setOpenScaleScrew(true);
    setScrewId(e.target.id);
  };

  /**
   * Adds/Removes opacity to the selected mesh
   * @param {Event} e
   */
  const handleOpacity = (e) => {
    dispatch(setSelectedMesh(e.target.attributes.id.nodeValue));
    const object = findById(e.target.attributes.id.nodeValue)(scene.children);

    object.material.transparent = !object.material.transparent;
    object.material.opacity = object.material.opacity === 1 ? 0.5 : 1;

    if (tControls.visible) {
      tControls.detach();
    }
  };

  const handleInfo = (e) => {
    const nodeId = e.target.attributes.id.nodeValue;

    setPanelTopPosition(e.target.getBoundingClientRect().top);
    dispatch(setSelectedMesh(nodeId));

    const object = findById(nodeId)(scene.children);
    setSelectedObject(object);
    setOpenObjectInfo(!openObjectInfo);

    if (tControls.visible) {
      tControls.detach();
    }
  };

  return (
    <>
      <div className={`option flex items-center text-black ${selected ? "option-active" : ""}`}>
        <span className="visible" id={uuid} onClick={handleClick} title="visibility"></span>
        {type === "points" ? (
          <span className="option__point" onClick={() => pointClick(uuid)}>
            {name}
          </span>
        ) : (
          <span>{name.startsWith("Group") ? name.slice(5) : name}</span>
        )}
        {(type === "planes" || type === "screw") && (
          <>
            <span id={uuid} name={name} className="translate" onClick={(e) => transformObject(e, "translate")} title="translate"></span>
            <span id={uuid} name={name} className="rotate" onClick={(e) => transformObject(e, "rotate")} title="rotate"></span>
            <span id={uuid} name={name} className="scale" onClick={(e) => transformObject(e, "scale")} title="scale"></span>
            <span id={uuid} name={name} className="opacity" onClick={handleOpacity} title="opacity" />
            {type === "screw" && <span id={uuid} name={name} className="height" onClick={(e) => handleScaleObject(e)} title="scale"></span>}
            {type === "planes" && (
              <>
                <span id={uuid} name={name} className="clipping" onClick={(e) => clippingMesh(e)} title="clipping"></span>
                {clipped && (
                  <span>
                    <input type="checkbox" name="" id="" onChange={handleNegated} />
                  </span>
                )}
              </>
            )}
            <span id={uuid} name={name} className="infoIcon" onClick={handleInfo} title="info plane" />
            {openObjectInfo && <PanelObjectInfo plane={selectedObject} panelTopPosition={panelTopPosition} />}
          </>
        )}
        {type === "scene" && (
          <>
            <span className="changeColor" id={uuid} onClick={modalColorMesh} title="change color" />
            <span className="offset" id={uuid} onClick={handleOffset} title="offset" />
            <span className="opacity" id={uuid} onClick={handleOpacity} title="opacity" />
          </>
        )}
        <span id={uuid} name={name} className="delete" onClick={deleteClick} title="delete"></span>
      </div>
      {openOffset && (
        <div className="p-1">
          <Offset meshId={meshToOffsetId} />
        </div>
      )}
      {openScaleScrew && (
        <div className="pt-1 pb-1">
          <ScaleScrew meshId={screwId} />
        </div>
      )}
      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Change mesh color" text="Change color">
        <ChangeColor onClick={changeColorMesh} onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}

PanelItem.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  deleteClick: PropTypes.func.isRequired,
};
