import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import shareIcon from "../../assets/images/icons/white/share-nodes-solid.svg";
import { setLoading } from "../../features/loading/loadingSlice";
import { getProject } from "../../features/project/projectSlice";
import useGetUsers from "../../hooks/useGetUsers";
import { updateProject } from "../../utils/api";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";

export default function Share() {
  const [isOpen, setIsOpen] = useState(false);
  const { users, fetchGetUsers } = useGetUsers();

  useEffect(() => {
    fetchGetUsers();
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button typeClass="btn--img btn__icon" img={shareIcon} onClick={() => setIsOpen(true)} title="Export" />
      <Modal open={isOpen} onClose={closeModal} title="Share project" text="Share">
        <ShareModal users={users} onClose={closeModal} />
      </Modal>
    </>
  );
}

function ShareModal({ users, onClose }) {
  const [selectedUser, setSelectedUser] = useState();
  const [errors, setErrors] = useState({});
  const { project } = useSelector(getProject);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { value } = e.target;
    setSelectedUser(value);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      setErrors({ ...errors, user: "Please select a user" });
    } else {
      onClose();
      dispatch(setLoading(true));
      await updateProject(project.id, {
        ...project,
        assignedAt: project.assignedAt === null ? [selectedUser] : [...project.assignedAt, selectedUser],
      });
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal__body h-72">
        <label htmlFor="assignedUser" className="form__label">
          Choose a user to assign the project
        </label>
        <select name="" id="assignedUser" className="form__select" onChange={handleChange}>
          <option value=""></option>
          {users.map((user, i) => (
            <option key={i} value={user.id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
        {errors.user && <p className="form__error">{errors.user}</p>}
      </div>
      <div className="modal__footer modal__border-t">
        <Button type="submit" typeClass="modal__btn-confirm" text="Save" />
        <Button type="button" typeClass="modal__btn-cancel" text="Cancel" onClick={onClose} />
      </div>
    </form>
  );
}

ShareModal.propTypes = {
  users: PropTypes.array,
  onClose: PropTypes.func,
};
