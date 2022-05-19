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
import PanelPlaneInfo from "../Panel/PanelPlaneInfo/PanelPlaneInfo";
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
  const [meshToOffset, setMeshToOffset] = useState();
  const [openPlaneInfo, setOpenPlaneInfo] = useState(false);
  const [selectedPlane, setSelectedPlane] = useState();

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

    const name = e.target.nextSibling.innerText;

    scene.children.forEach((object) => {
      if (object.type === "Group") {
        object.children.forEach((item) => {
          if (item.name === name) {
            item.visible = !item.visible;
          }
        });
      } else if (object.type === "Mesh") {
        if (object.name === name) {
          object.visible = !object.visible;
          // checks if the object has a label and makes it visible or invisible
          object.children.length > 0 && (object.children[0].visible = !object.children[0].visible);
          if (tControls.visible) tControls.detach();
          // else tControls.attach();
        }
      }
    });
  };

  /**
   * Buttons to handle the transformation of the plane
   * @param {Event} e
   * @param {*} mode Transformation mode
   */
  const transformPlane = (e, mode) => {
    dispatch(setSelectedMesh(e.target.attributes.id.nodeValue));
    const name = e.target.attributes.name.nodeValue;

    scene.children.forEach((object) => {
      if (object.name === name) {
        tControls.attach(object);
        tControls.setMode(mode);
      }
    });
  };

  /**
   * Clipping the selected mesh
   * @param {Event} e
   */
  const clippingMesh = (e) => {
    setClipped((prev) => !prev);

    const result = scene.children.filter((object) => object.name.startsWith("Clipping"));

    if (result.length === 0) {
      const planeUuid = e.target.attributes.id.nodeValue;
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
      if (mesh.name.startsWith("Point")) {
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
    scene.children.map((object) => {
      if (object.type === "Group") {
        object.children.map((mesh) => {
          if (mesh.uuid === selectedMesh) {
            mesh.material.color.set(color);
          }
        });
      }
    });
    setIsOpen(false);
  };

  /**
   * Handles the offset of the mesh
   * @param {Event} e
   */
  const handleOffset = (e) => {
    setOpenOffset(true);
    setMeshToOffset(e.target.id);
  };

  const findById = (id) => (list) => list.flatMap((item) => (item.children ? [item, ...item.children] : item)).find((item) => item.uuid === id);

  /**
   * Adds/Removes opacity to the selected mesh
   * @param {Event} e
   */
  const handleOpacity = (e) => {
    const object = findById(e.target.attributes.id.nodeValue)(scene.children);

    object.material.transparent = !object.material.transparent;
    object.material.opacity = object.material.opacity === 1 ? 0.5 : 1;
  };

  const handleInfo = (e) => {
    const plane = findById(e.target.attributes.id.nodeValue)(scene.children);
    setSelectedPlane(plane);
    setOpenPlaneInfo(!openPlaneInfo);
  };

  return (
    <>
      <div className={`option flex items-center text-black ${selected ? "option-active" : ""}`}>
        <span className="visible" id={uuid} onClick={handleClick}></span>
        {type === "points" ? (
          <span className="option__point" onClick={() => pointClick(uuid)}>
            {name}
          </span>
        ) : (
          <span>{name}</span>
        )}
        {type === "planes" && (
          <>
            <span id={uuid} name={name} className="translate" onClick={(e) => transformPlane(e, "translate")}></span>
            <span id={uuid} name={name} className="rotate" onClick={(e) => transformPlane(e, "rotate")}></span>
            <span id={uuid} name={name} className="scale" onClick={(e) => transformPlane(e, "scale")}></span>
            <span id={uuid} name={name} className="clipping" onClick={(e) => clippingMesh(e)}></span>
            {clipped && (
              <span>
                <input type="checkbox" name="" id="" onChange={handleNegated} />
              </span>
            )}
            <span id={uuid} name={name} className="opacity" onClick={handleOpacity} />
            <span id={uuid} name={name} className="infoIcon" onClick={handleInfo} />
            {openPlaneInfo && <PanelPlaneInfo plane={selectedPlane} />}
          </>
        )}
        {type === "scene" && (
          <>
            <span className="changeColor" id={uuid} onClick={modalColorMesh} />
            <span className="offset" id={uuid} onClick={handleOffset} />
            <span className="opacity" id={uuid} onClick={handleOpacity} />
          </>
        )}
        <span id={uuid} name={name} className="delete" onClick={deleteClick}></span>
      </div>
      <div className="p-1">{openOffset && <Offset mesh={meshToOffset} />}</div>
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
