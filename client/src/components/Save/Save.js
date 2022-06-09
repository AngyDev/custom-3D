import React, { useState } from "react";
import Button from "../Button/Button";
import saveIcon from "../../assets/images/icons/white/save-solid.svg";
import { getChildren, getGroup } from "../../features/scene/sceneSlice";
import { useSelector } from "react-redux";
import { saveObject } from "../../utils/api";
import Modal from "../Modal/Modal";
import Spinner from "../Spinner/Spinner";
import PropTypes from "prop-types";

export default function Save({ projectId }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const children = useSelector(getChildren);
  const group = useSelector(getGroup);

  const openModal = () => {
    setIsOpen(true);
  };

  const saveObjects = async () => {
    const mesh = children.filter((item) => item.type === "Mesh");

    setIsOpen(false);

    // is not possible to create a unique array of group and mesh because it adds the mesh to the group in the scene,
    // why? I don't know
    for (const object of group.children) {
      await save(object);
    }

    for (const item of mesh) {
      await save(item);
    }
  };

  const save = async (object) => {
    setLoading(true);
    // updates the matrix position before convert to JSON
    object.updateMatrixWorld(true);

    const json = object.toJSON();
    const output = JSON.stringify(json);
    const file = new Blob([output], { type: "application/json" });
    await saveObject(object.uuid, projectId, file, `${object.uuid}.json`);
    setLoading(false);

    // saveObject(object.uuid, projectId, file, `${object.uuid}.json`).then((error) => {
    //   alert(error);
    // }).then(() => {
    //   setLoading(false);
    // });
  };

  return (
    <>
      {loading ? <Spinner /> : ""}
      <Button typeClass="btn--img btn__icon" img={saveIcon} onClick={openModal} title="Save" />
      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Save Objects" text="Save">
        <div className="modal__body flex flex-col">
          <h3 className="text-white">Are you Sure?</h3>
        </div>
        <div className="modal__footer modal__border-t">
          <Button type="button" typeClass="modal__btn-confirm" text="Save" onClick={saveObjects} />
          <Button type="button" typeClass="modal__btn-cancel" text="Cancel" onClick={() => setIsOpen(false)} />
        </div>
      </Modal>
    </>
  );
}

Save.propTypes = {
  projectId: PropTypes.string,
};
