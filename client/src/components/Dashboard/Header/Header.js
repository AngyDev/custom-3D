import React, { useContext, useState } from "react";
import Button from "../../Button/Button";
import Logo from "../../Logo/Logo";
import plus from "../../../assets/images/icons/white/plus-solid.svg";
import Modal from "../../Modal/Modal";
import NewProject from "../NewProject/NewProject";
import { useHistory } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { saveProject } from "../../../services/api";
import Theme from "../../Theme/Theme";
import { ThemeContext } from "../../../context/ThemeContext";
import { useDispatch } from "react-redux";
import { dispatchError } from "../../../features/error/errorSlice";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(false);

  const history = useHistory();
  const { user } = useAuth();
  const [theme] = useContext(ThemeContext);
  const dispatch = useDispatch();

  const saveNewProject = (data) => {
    saveProject(user.id, data)
      .then((response) => {
        console.log("saveProject", response);
        setIsOpen(false);
        history.push(`/editor/${response.data.id}`);
      })
      .catch((error) => {
        console.log("error", error);
        dispatch(dispatchError(error.message));
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

  return (
    <div className="container-component flex w-full h-18 bg-baseLight dark:bg-base text-white p-3">
      <div className="flex gap-5 w-full justify-between">
        <div className="flex flex-row gap-5 items-center">
          <Logo className="h-10" theme={theme} />
          <Button text="Nuovo" img={plus} onClick={openModal} title="Nuovo" active={active} />
        </div>
        <div>
          <Theme />
        </div>
      </div>
      {isOpen && (
        <div>
          <Modal open={isOpen} onClose={closeModal} title="New Project" text="Save">
            <NewProject isOpen={isOpen} saveNewProject={saveNewProject} onClose={closeModal} />
          </Modal>
        </div>
      )}
    </div>
  );
}
