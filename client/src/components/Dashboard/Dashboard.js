import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Button from '../Button/Button'
import Modal from '../Modal/Modal';
import NewProject from './NewProject/NewProject';
import Projects from './Projects/Projects';
import { saveProject } from '../../utils/api';

export default function Dashboard() {

    const history = useHistory();
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(true);
    }

    const openNewProject = () => {
        history.push("/editor");
    }

    const saveNewProject = async (data) => {
        await saveProject("d27db05e-fb3f-4942-a517-59fefbd97937", data);
        history.push("/editor");
        setIsOpen(false);
    }

    return (
        <div className="container">
            <h1 className="text-center mt-5">Projects list</h1>
            <Projects />
            <Button typeClass="btn--size" text="NEW PROJECT" onClick={handleClick} />
            <Modal open={isOpen} onClose={() => setIsOpen(false)} onClick={openNewProject} title="New Project" text="Save">
                <NewProject isOpen={isOpen} saveNewProject={saveNewProject} />
            </Modal>
        </div>
    )
}
