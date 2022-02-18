import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import { getIsTextOpen, setIsTextOpen } from "../../features/comments/commentsSlice";
import { getGroup, getScene, getSelectedMesh, setSelectedMesh } from "../../features/scene/sceneSlice";
import ChangeColor from "../ChangeColor/ChangeColor";
import Modal from "../Modal/Modal";
import Offset from "../Offset/Offset";

export default function PanelItem(props) {
  const scene = useSelector(getScene);
  const group = useSelector(getGroup);
  const tControls = scene.children && scene.children.find((obj) => obj.name === "TransformControls");
  const selectedMesh = useSelector(getSelectedMesh);
  const [selected, setSelected] = useState(false);
  const isTextOpen = useSelector(getIsTextOpen);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [plane, setPlane] = useState(new THREE.Plane());
  const [clipped, setClipped] = useState(false);
  const [openOffset, setOpenOffset] = useState(false);
  const [meshToOffset, setMeshToOffset] = useState();

  useEffect(() => {
    // checks the selected mesh to add background to panel object
    if (props.uuid === selectedMesh) {
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

  const clippingMesh = (e) => {
    const planeUuid = e.target.attributes.id.nodeValue;
    const planeMesh = scene.children.filter((item) => item.uuid === planeUuid)[0];

    // const plane = new THREE.Plane();
    const normal = new THREE.Vector3();
    const point = new THREE.Vector3();

    // Create a THREE.Plane from a THREE.PlaneGeometry
    normal.set(0, 0, 1).applyQuaternion(planeMesh.quaternion);
    point.copy(planeMesh.position);
    plane.setFromNormalAndCoplanarPoint(normal, point);

    group.children.map((object) => {
      if (!object.material.clippingPlanes || object.material.clippingPlanes.length === 0) {
        object.material.clippingPlanes = [plane];
      } else {
        object.material.clippingPlanes = [];
      }
    });

    setClipped((prev) => !prev);
  };

  const handleNegated = (e) => {
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

  const modalColorMesh = (e) => {
    dispatch(setSelectedMesh(e.target.id));
    setIsOpen(true);
  };

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

  const handleOffset = (e) => {
    setOpenOffset(true);
    setMeshToOffset(e.target.id);
  };

  return (
    <>
      <div className={selected ? "option option-active flex align-center" : "option flex align-center"}>
        <span className="visible" id={props.uuid} onClick={handleClick}></span>
        {props.type === "points" ? (
          <span className="option__point" onClick={() => pointClick(props.uuid)}>
            {props.name}
          </span>
        ) : (
          <span>{props.name}</span>
        )}
        {props.type === "planes" && (
          <>
            <span id={props.uuid} name={props.name} className="translate" onClick={(e) => transformPlane(e, "translate")}></span>
            <span id={props.uuid} name={props.name} className="rotate" onClick={(e) => transformPlane(e, "rotate")}></span>
            <span id={props.uuid} name={props.name} className="scale" onClick={(e) => transformPlane(e, "scale")}></span>
            <span id={props.uuid} name={props.name} className="clipping" onClick={(e) => clippingMesh(e)}></span>
            {clipped && (
              <span>
                <input type="checkbox" name="" id="" onChange={handleNegated} />
              </span>
            )}
          </>
        )}
        {props.type === "scene" && (
          <>
            <span className="changeColor" id={props.uuid} onClick={modalColorMesh} />{" "}
            <span className="offset" id={props.uuid} onClick={handleOffset} />
          </>
        )}
        <span id={props.uuid} name={props.name} className="delete" onClick={props.deleteClick}></span>
      </div>
      <div>{openOffset && <Offset mesh={meshToOffset} />}</div>
      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Change mesh color" text="Change color">
        <ChangeColor onClick={changeColorMesh} />
      </Modal>
    </>
  );
}
