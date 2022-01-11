import React, { useContext, useState } from "react";
import Button from "../Button/Button";
import saveIcon from "../../assets/images/icons/save-solid.svg";
import { useSelector } from "react-redux";
import { getScene, getChildren } from "../../features/scene/sceneSlice";
import { saveObject } from "../../utils/api";
import Modal from "../Modal/Modal";

export default function Save({ projectId }) {
  const [isOpen, setIsOpen] = useState(false);
  const scene = useSelector(getScene);
  const children = useSelector(getChildren);

  const openModal = () => {
    setIsOpen(true);
  };

  const saveObjects = async () => {
    const group = children.filter((item) => item.type === "Group");
    const mesh = children.filter((item) => item.type === "Mesh");
    const objects = group[0].children.length > 0 ? group[0].children : [];

    for (const iterator of mesh) {
      objects.push(iterator);
    }

		console.log(objects);

    for (const mesh of objects) {
      const json = mesh.toJSON();
      const output = JSON.stringify(json);
      const file = new Blob([output], { type: "application/json" });

      const response = await saveObject(mesh.uuid, projectId, file, `${mesh.uuid}.json`);
    }

    setIsOpen(false);
  };

  return (
    <>
      <Button typeClass="btn--img" img={saveIcon} onClick={openModal} title="Save" />
      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Save Objects" text="Save">
        <div className="flex flex-col">
          <h3>Are you Sure?</h3>
          <div className="flex justify-end">
            <Button typeClass="btn--size" text="OK" onClick={saveObjects} />
          </div>
        </div>
      </Modal>
    </>
  );
}
