import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import shareIcon from "../../assets/images/icons/white/share-nodes-solid.svg";
import { setLoading } from "../../features/loading/loadingSlice";
import { getProject, updatedProject } from "../../features/project/projectSlice";
import useGetUsers from "../../hooks/useGetUsers";
import { updateProject } from "../../utils/api";
import { Autocomplete } from "../Autocomplete/Autocomplete";
import { Badge } from "../Badge/Badge";
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
      <Button typeClass="btn--img btn__icon" img={shareIcon} onClick={() => setIsOpen(true)} title="Share" />
      <Modal open={isOpen} onClose={closeModal} title="Share project" text="Share">
        <ShareModal users={users} onClose={closeModal} />
      </Modal>
    </>
  );
}

function ShareModal({ users, onClose }) {
  const { project } = useSelector(getProject);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState([]);

  const owner = users.filter((user) => user.id === project.userId)[0];

  const onChange = (e) => {
    const userText = e.target.value;
    let matches = [];
    if (userText.length > 0) {
      matches = users.filter((user) => {
        const regex = new RegExp(`${userText}`, "gi");
        return user.firstName.match(regex) || user.lastName.match(regex);
      });
    }

    setSuggestions(matches);
    setText(userText);
  };

  const onSuggestionHandler = (suggestion) => {
    setSelectedSuggestion((prev) => [...prev, suggestion]);
    setSuggestions([]);
  };

  const onRemove = (item) => {
    setSelectedSuggestion((prev) => prev.filter((i) => i.id !== item.id));
    setText("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(selectedSuggestion);

    if (selectedSuggestion.length === 0) {
      setErrors({ ...errors, user: "Please select a user" });
    } else {
      onClose();
      dispatch(setLoading(true));
      // TODO: update project with a list of users
      const projectUpdate = await updateProject(project.id, {
        ...project,
        assignedAt: project.assignedAt === null ? [selectedUser] : [...project.assignedAt, selectedUser],
      });
      dispatch(updatedProject(projectUpdate));
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal__body h-72">
        <div className="flex flex-col">
          <p className="form__label">
            Project Owner: {owner.firstName} {owner.lastName}
          </p>
          <div className="mb-2 flex gap-1 flex-wrap">
            {selectedSuggestion.length > 0 &&
              selectedSuggestion.map((user, i) => (
                <div key={i}>
                  <Badge text={user.firstName + " " + user.lastName} handleClick={() => onRemove(user)} />
                </div>
              ))}
          </div>
          <label htmlFor="assignedUser" className="form__label">
            Choose a user to assign the project
          </label>
          <Autocomplete text={text} onChange={onChange} suggestions={suggestions} onSuggestionHandler={onSuggestionHandler} />
          {errors.user && <p className="form__error">{errors.user}</p>}
        </div>
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
