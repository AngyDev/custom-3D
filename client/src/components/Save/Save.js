import React, { useContext, useState } from "react";
import Button from "../Button/Button";
import saveIcon from "../../assets/images/icons/save-solid.svg";
import { getChildren } from "../../features/scene/sceneSlice";
import { useSelector } from "react-redux";
import { saveObject } from "../../utils/api";
import Modal from "../Modal/Modal";

export default function Save({ projectId }) {
  const [isOpen, setIsOpen] = useState(false);
  const children = useSelector(getChildren);

  const openModal = () => {
    setIsOpen(true);
  };

  const saveObjects = async () => {
    const group = children.filter((item) => item.type === "Group");
    const mesh = children.filter((item) => item.type === "Mesh");

    // is not possible to create a unique array of group and mesh because it adds the mesh to the group in the scene, 
    // why? I don't know
    for (const object of group[0].children) {
      await save(object);
    }

    for (const item of mesh) {
      await save(item);
    }

    setIsOpen(false);
  };

  const save = async (object) => {
    // updates the matrix position before convert to JSON
    object.updateMatrixWorld(true);

    const json = object.toJSON();
    const output = JSON.stringify(json);
    const file = new Blob([output], { type: "application/json" });
    await saveObject(object.uuid, projectId, file, `${object.uuid}.json`);
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
