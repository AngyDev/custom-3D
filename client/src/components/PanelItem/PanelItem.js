import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getIsTextOpen, setIsTextOpen } from "../../features/comments/commentsSlice";
import { getScene, getSelectedMesh, setSelectedMesh } from "../../features/scene/sceneSlice";

export default function PanelItem(props) {
  const scene = useSelector(getScene);
  const tControls = scene.children && scene.children.find((obj) => obj.name === "TransformControls");
  const selectedMesh = useSelector(getSelectedMesh);
  const [selected, setSelected] = useState(false);
  const isTextOpen = useSelector(getIsTextOpen);
  const dispatch = useDispatch();

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
          </>
        )}
        <span id={props.uuid} name={props.name} className="delete" onClick={props.deleteClick}></span>
      </div>
    </>
  );
}
