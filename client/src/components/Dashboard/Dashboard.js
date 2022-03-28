import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { UserContext } from "../../context/UserContext";
import { saveProject } from "../../utils/api";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import NewProject from "./NewProject/NewProject";
import Projects from "./Projects/Projects";

export default function Dashboard() {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(UserContext);

  const handleClick = () => {
    setIsOpen(true);
  };

  const saveNewProject = async (data) => {
    const response = await saveProject(user.id, data);
    history.push(`/editor/${response.id}`);
    setIsOpen(false);
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5">Projects list</h1>
      <Projects />
      <Button typeClass="btn--size" text="NEW PROJECT" onClick={handleClick} />
      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="New Project" text="Save">
        <NewProject isOpen={isOpen} saveNewProject={saveNewProject} />
      </Modal>
    </div>
  );
}
