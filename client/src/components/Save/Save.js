import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import saveIcon from "../../assets/images/icons/white/save-solid.svg";
import { setLoading } from "../../features/loading/loadingSlice";
import { getChildren, getGroup } from "../../features/scene/sceneSlice";
import { getObjectsToRemove } from "../../features/objects/objectsSlice";
import { getTemporaryComments, getProjectComments } from "../../features/comments/commentsSlice";
import { useGetObjectsByProjectId } from "../../hooks/useGetObjectsByProjectId";
import { saveObject, updateProject, deleteObject, saveComment } from "../../services/api";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { useGetCommentsByProjectId } from "../../hooks/useGetCommentsByProjectId";

export default function Save({ projectId }) {
  const children = useSelector(getChildren);
  const group = useSelector(getGroup);
  const objectsToRemove = useSelector(getObjectsToRemove);
  const projectComments = useSelector(getProjectComments);
  const temporaryComments = useSelector(getTemporaryComments);
  const dispatch = useDispatch();

  const { fetchGetObjectsByProjectId } = useGetObjectsByProjectId();
  const { fetchGetCommentsByProjectId } = useGetCommentsByProjectId();

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const saveObjects = async () => {
    const mesh = children.filter((item) => item.type === "Mesh");

    setIsOpen(false);

    dispatch(setLoading(true));

    // remove the object from the db
    for (const object of objectsToRemove) {
      await deleteObject(object.id);
    }

    console.log(children);

    // update project updatedAt date
    await updateProject(projectId, {});

    // It is not possible to create a unique array of group and mesh because it adds the mesh to the group in the scene,
    // why? I don't know
    // Group "Import"
    for (const object of group.children) {
      await save(object);
    }

    const measure = children.filter((item) => item.name.startsWith("Measure"));

    for (const object of measure) {
      for (const item of object.children) {
        await save(item);
      }
    }

    for (const item of mesh) {
      if (!item.name.startsWith("Offset")) {
        await save(item);
      }
    }

    if (projectComments.length !== temporaryComments.length) {
      // get the comments to save
      const commentsToAdd = temporaryComments.filter((item) => !projectComments.includes(item));

      // save the comments
      for (const comment of commentsToAdd) {
        await saveComment(comment);
      }
    }

    // set the objects state with the correct list of the objects and comments after the save
    // TODO:  Is it correct to reload the location or calls the api again?
    // window.location.reload();
    fetchGetObjectsByProjectId(projectId);
    fetchGetCommentsByProjectId(projectId);
    dispatch(setLoading(false));
  };

  const save = async (object) => {
    // updates the matrix position before convert to JSON
    object.updateMatrixWorld(true);

    const json = object.toJSON();
    const output = JSON.stringify(json);
    const file = new Blob([output], { type: "application/json" });
    await saveObject(object.uuid, object.name, projectId, file, `${object.uuid}.json`);

    // saveObject(object.uuid, projectId, file, `${object.uuid}.json`).then((error) => {
    //   alert(error);
    // }).then(() => {
    //   setLoading(false);
    // });
  };

  return (
    <>
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
