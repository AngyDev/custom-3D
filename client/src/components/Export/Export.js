import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import downloadIcon from "../../assets/images/icons/white/upload-solid.svg";
import { getChildren } from "../../features/scene/sceneSlice";
import Button from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import Modal from "../Modal/Modal";
import PropTypes from "prop-types";

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
  const [values, setValues] = useState({ files: [], filename: "" });
  const [meshes, setMeshes] = useState([]);

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
    values.files.map((obj) => {
      const mesh = meshes.filter((option) => option.name === obj)[0];
      // Clone the mesh otherwise the meshes disappear from the scene
      group.add(mesh.clone());
    });
    const result = exporter.parse(group, { binary: true });
    save(new Blob([result], { type: "application/octet-stream" }), `${values.filename}.stl`);
    onClose();
  };

  const save = (blob, filename) => {
    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="modal__body">
          <div className="mb-4 grid grid-cols-2 gap-2 overflow-y-scroll h-36">
            {meshes.map((item, i) => (
              <Checkbox key={i} label={item.name} value={item.name} name="files" onChange={(e) => handleChange(e, "array")} />
            ))}
          </div>
          <div className="flex items-center">
            <label className="form__label pr-2" htmlFor="filename">
              Name:
            </label>
            <input className="form__input" type="input" placeholder="Enter filename" name="filename" onChange={handleChange} />
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
