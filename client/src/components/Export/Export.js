import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import downloadIcon from "../../assets/images/icons/white/upload-solid.svg";
import { getChildren, getPositionVector } from "../../features/scene/sceneSlice";
import Button from "../atoms/Button/Button";
import { Checkbox } from "../atoms/Checkbox/Checkbox";
import Modal from "../Modal/Modal";
import PropTypes from "prop-types";
import { downloadObject } from "../../utils/functions/downloadObject";

export default function Export() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button typeClass="btn--img btn__icon" img={downloadIcon} onClick={openModal} title="Export" />
      <Modal open={isOpen} onClose={closeModal} title="Export Objects" text="Export">
        <ExportModal onClose={closeModal} />
      </Modal>
    </>
  );
}

function ExportModal({ onClose }) {
  const children = useSelector(getChildren);
  const position = useSelector(getPositionVector);
  const [values, setValues] = useState({ files: [], filename: "" });
  const [meshes, setMeshes] = useState([]);
  const [errors, setErros] = useState({});

  useEffect(() => {
    if (children !== undefined) {
      children.map((item) => {
        // if (item.type === "Mesh" && !item.name.startsWith("Offset")) {
        if (item.type === "Mesh") {
          // if (item.type === "Mesh") {
          setMeshes((prev) => [...prev, item]);
        }
        if (item.type === "Group" && item.name === "Import" && item.children.length !== 0) {
          item.children.forEach((obj) => setMeshes((prev) => [...prev, obj]));
        }
      });
    }
  }, []);

  const handleChange = (e, type) => {
    const { value, name } = e.target;

    if (type === "array") {
      if (values.files.includes(value)) {
        return setValues((prev) => {
          return {
            ...prev,
            [name]: [...prev[name], value].filter((el) => el !== value),
          };
        });
      } else {
        return setValues((prev) => {
          return { ...prev, [name]: [...prev[name], value] };
        });
      }
    }

    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const exporter = new STLExporter();
    const group = new THREE.Group();

    // Checks if the user has selected any objects
    if (values.files.length !== 0) {
      // Checks if the user has inserted a filename
      if (values.filename !== "") {
        values.files.map((obj) => {
          const mesh = meshes.filter((option) => option.name === obj)[0];

          // Clone the mesh otherwise the meshes disappear from the scene
          const newMesh = mesh.clone();

          // translate the position of the mesh to match with the imported mesh
          newMesh.translateX(position.x);
          newMesh.translateY(position.y);
          newMesh.translateZ(position.z);

          group.add(newMesh);
        });
        const result = exporter.parse(group, { binary: true });
        downloadObject(new Blob([result], { type: "application/octet-stream" }), `${values.filename}.stl`);
        onClose();
      } else {
        setErros({ filename: "Please enter a filename" });
      }
    } else {
      setErros({ check: "Please select at least one object" });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="modal__body h-72">
          <div>
            <div className="mb-4 grid grid-cols-2 gap-2 content-start overflow-y-scroll h-36">
              {meshes.map((item, i) => (
                <Checkbox key={i} label={item.name} value={item.name} name="files" onChange={(e) => handleChange(e, "array")} />
              ))}
            </div>
            {errors.check ? <p className="h-5 text-red-500">{errors.check}</p> : <p className="h-5"></p>}
          </div>
          <div>
            <div className="flex items-center">
              <label className="form__label pr-2" htmlFor="filename">
                Name:
              </label>
              <input className="form__input" type="input" placeholder="Enter filename" name="filename" id="filename" onChange={handleChange} />
            </div>
            {errors.filename ? <div className="h-5 text-red-500">{errors.filename}</div> : <p className="h-5"></p>}
          </div>
        </div>
        <div className="modal__footer modal__border-t">
          <Button type="submit" typeClass="modal__btn-confirm" text="Export" />
          <Button type="button" typeClass="modal__btn-cancel" text="Cancel" onClick={onClose} />
        </div>
      </form>
    </div>
  );
}

ExportModal.propTypes = {
  onClose: PropTypes.func,
};
