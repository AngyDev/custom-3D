import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import saveIcon from "../../assets/images/icons/white/save-solid.svg";
import { setLoading } from "../../features/loading/loadingSlice";
import { getChildren, getGroup } from "../../features/scene/sceneSlice";
import { getObjectsToRemove, removeObjectFromRemove } from "../../features/objects/objectsSlice";
import { getTemporaryComments, getProjectComments } from "../../features/comments/commentsSlice";
import { useGetObjectsByProjectId } from "../../hooks/useGetObjectsByProjectId";
import { saveObject, updateProject, deleteObject, saveComment } from "../../services/api";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { useGetCommentsByProjectId } from "../../hooks/useGetCommentsByProjectId";
import { dispatchError } from "../../features/error/errorSlice";

export default function Save({ projectId, disabled }) {
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

  const saveObjects = () => {
    setIsOpen(false);
    dispatch(setLoading(true));

    console.log("objectsToRemove", objectsToRemove);

    // remove the object from the db
    for (const object of objectsToRemove) {
      deleteObject(object.id)
        .then(() => {
          // remove the object from the array
          dispatch(removeObjectFromRemove(object.id));
        })
        .catch((error) => {
          dispatch(dispatchError(error));
        });
    }

    // update project updatedAt date
    updateProject(projectId, {})
      .then(() => {})
      .catch((error) => {
        dispatch(dispatchError(error));
      });

    const mesh = children.filter((item) => item.type === "Mesh" && !item.name.startsWith("Offset"));
    const importedMesh = [...group.children];
    const measuresGroup = children.filter((item) => item.name.startsWith("Measure"));
    const measures = measuresGroup.flatMap((item) => (item.children ? [...item.children] : item));

    const objects = [...mesh, ...importedMesh, ...measures];

    // TODO: Checks if the object is saved before the comment

    const promisesObjects = objects.map((object) => {
      return new Promise((resolve, reject) => {
        const file = getFile(object);
        saveObject(object.uuid, object.name, projectId, file, `${object.uuid}.json`)
          .then(() => {
            console.log("object saved");
            resolve();
          })
          .catch((error) => {
            dispatch(dispatchError(error));
            reject();
          });
      });
    });

    Promise.all(promisesObjects).then(
      () => {
        console.log("promise all");
        fetchGetObjectsByProjectId(projectId);
      },
      (error) => {
        dispatch(dispatchError(error));
      },
    );

    // Comments
    if (projectComments.length !== temporaryComments.length) {
      // get the comments to save
      const commentsToAdd = temporaryComments.filter((item) => !projectComments.includes(item));

      // save the comments
      const promisesComments = commentsToAdd.map((comment) => {
        return new Promise((resolve, reject) => {
          saveComment(comment)
            .then(() => {
              console.log("comment saved");
              resolve();
            })
            .catch((error) => {
              dispatch(dispatchError(error));
              reject();
            });
        });
      });

      Promise.all(promisesComments).then(
        () => {
          console.log("promise all comments");
          fetchGetCommentsByProjectId(projectId);
        },
        (error) => {
          dispatch(dispatchError(error));
        },
      );
    }

    // set the objects state with the correct list of the objects and comments after the save
    // TODO:  Is it correct to reload the location or calls the api again?
    // window.location.reload();

    dispatch(setLoading(false));
  };

  const getFile = (object) => {
    // updates the matrix position before convert to JSON
    object.updateMatrixWorld(true);

    const json = object.toJSON();
    const output = JSON.stringify(json);
    const file = new Blob([output], { type: "application/json" });

    return file;
  };

  return (
    <>
      <Button typeClass="btn--img btn__icon" img={saveIcon} onClick={openModal} title="Save" disabled={disabled} />
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
  disabled: PropTypes.bool,
};
