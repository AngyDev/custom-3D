import React from 'react'
import { useHistory } from 'react-router'
import Button from '../Button/Button'

export default function Dashboard() {

    const history = useHistory();

    const openProject = () => {
        history.push("/editor");
    }

    return (
        <div>
            <h1>Projects list</h1>
            <Button typeClass="btn--size" text="NEW PROJECT" onClick={openProject}/>
        </div>
    )
}
