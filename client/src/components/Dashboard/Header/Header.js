import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import archiveIcon from "../../../assets/images/icons/white/box-archive-solid.svg";
import dashboardIcon from "../../../assets/images/icons/white/th-large-solid.svg";
import plus from "../../../assets/images/icons/white/plus-solid.svg";
import { useAuth } from "../../../context/AuthContext";
import { ThemeContext } from "../../../context/ThemeContext";
import { dispatchError } from "../../../features/error/errorSlice";
import { saveProject } from "../../../services/api";
import Button from "../../atoms/Button/Button";
import Logo from "../../atoms/Logo/Logo";
import Modal from "../../Modal/Modal";
import Profile from "../../Profile/Profile";
import Theme from "../../Theme/Theme";
import NewProject from "../NewProject/NewProject";

export default function Header({ archived }) {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(false);

  const history = useHistory();
  const { user } = useAuth();
  const [theme] = useContext(ThemeContext);
  const dispatch = useDispatch();

  const saveNewProject = (data) => {
    saveProject(user.id, data)
      .then((response) => {
        setIsOpen(false);
        history.push(`/editor/${response.data.id}`);
      })
      .catch((error) => {
        dispatch(dispatchError(error));
      });
  };

  const openModal = () => {
    setActive(!active);
    setIsOpen(true);
  };

  const closeModal = () => {
    setActive(!active);
    setIsOpen(false);
  };

  const toArchived = () => {
    history.push("/archived");
  };

  const toDashboard = () => {
    history.push("/dashboard");
  };

  return (
    <div className="container-component flex w-full h-18 bg-baseLight dark:bg-base text-white p-3">
      <div className="flex gap-5 w-full items-center">
        <div className="flex flex-row gap-5 items-center">
          <Logo className="h-10" theme={theme} />
          {!archived ? (
            <>
              <Button text="New" img={plus} onClick={openModal} title="New" active={active} />
              <Button typeClass="btn--img btn__icon" img={archiveIcon} onClick={toArchived} title="Archived" />
            </>
          ) : (
            <Button typeClass="btn--img btn__icon" img={dashboardIcon} onClick={toDashboard} title="Dashboard" />
          )}
        </div>
        <div className="flex gap-5 items-center ml-auto">
          <Theme />
          <Profile />
        </div>
      </div>
      {isOpen && (
        <div>
          <Modal open={isOpen} onClose={closeModal} title="New Project" text="Save">
            <NewProject saveNewProject={saveNewProject} onClose={closeModal} />
          </Modal>
        </div>
      )}
    </div>
  );
}

Header.propTypes = {
  archived: PropTypes.bool,
};
