import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import downloadIcon from "../../assets/images/icons/download-solid.svg";
import { getChildren, getGroup } from "../../features/scene/sceneSlice";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import { Checkbox } from "../Checkbox/Checkbox";
import * as THREE from "three";

export default function Export() {
  const [isOpen, setIsOpen] = useState(false);
  const children = useSelector(getChildren);

  const options = [];
  if (children !== undefined) {
    children.map((item) => {
      if (item.type === "Mesh") {
        options.push(item);
      }
      if (item.type === "Group" && item.children.length !== 0) {
        item.children.forEach((obj) => options.push(obj));
      }
    });
  }

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button typeClass="btn--img" img={downloadIcon} onClick={openModal} title="Export" />
      <Modal open={isOpen} onClose={closeModal} title="Export Objects" text="Export">
        <ExportModal options={options} closeModal={closeModal} />
      </Modal>
    </>
  );
}

function ExportModal({ options, closeModal }) {
  const [values, setValues] = useState({ files: [], filename: "" });

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
      const mesh = options.filter((option) => option.name === obj)[0];
      // Clone the mesh otherwise the meshes disappear from the scene
      group.add(mesh.clone());
    });
    const result = exporter.parse(group, { binary: true });
    save(new Blob([result], { type: "application/octet-stream" }), `${values.filename}.stl`);
    closeModal();
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
        {options.map((item, i) => (
          <Checkbox
            key={i}
            label={item.name}
            value={item.name}
            name="files"
            onChange={(e) => handleChange(e, "array")}
          />
        ))}
        <input
          className="form__input"
          type="input"
          placeholder="Enter filename"
          name="filename"
          onChange={handleChange}
        />
        <Button typeClass="btn--size" text="Save" />
      </form>
    </div>
  );
}
