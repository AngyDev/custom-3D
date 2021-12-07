import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import Button from '../Button/Button'
import Projects from './Projects/Projects';

export default function Dashboard() {

    const history = useHistory();

    const openProject = () => {
        history.push("/editor");
    }

    return (
        <div>
            <h1>Projects list</h1>
            <Projects />
            <Button typeClass="btn--size" text="NEW PROJECT" onClick={openProject}/>
        </div>
    )
}
