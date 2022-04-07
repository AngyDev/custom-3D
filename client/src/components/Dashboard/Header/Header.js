import React, { useContext, useState } from "react";
import Button from "../../Button/Button";
import Logo from "../../Logo/Logo";
import plus from "../../../assets/images/icons/plus.svg";
import Modal from "../../Modal/Modal";
import NewProject from "../NewProject/NewProject";
import { useHistory } from "react-router";
import { UserContext } from "../../../context/UserContext";
import { saveProject } from "../../../utils/api";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(false);

  const history = useHistory();
  const { user } = useContext(UserContext);

  const saveNewProject = async (data) => {
    const response = await saveProject(user.id, data);
    history.push(`/editor/${response.id}`);
    setIsOpen(false);
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
    <div className="container-component flex w-full h-18 bg-base text-white p-3">
      <div className="flex gap-5">
        <Logo />
        <Button text="Nuovo" img={plus} onClick={openModal} title="Nuovo" active={active} />
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
