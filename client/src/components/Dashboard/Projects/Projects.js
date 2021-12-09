import React from 'react';
import { useHistory } from 'react-router';
import useGetProjectsByUserId from '../../../hooks/useGetProjectsByUserId';
import Button from '../../Button/Button';

export default function Projects() {

    const { projects } = useGetProjectsByUserId();
    const history = useHistory();

    const openProject = (id) => {
        history.push(`/editor/${id}`);
    }

    return (
        <>
            <table className="table mt-5 text-center">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Patient Code</th>
                        <th>Status</th>
                        <th>Open Project</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(projects).length > 0 && projects.map((project, i) =>
                            <tr key={project.id}>
                                <td>{project.projectName}</td>
                                <td>{project.patientCode}</td>
                                <td>{project.status}</td>
                                <td><Button typeClass="btn--size" text="Open" onClick={() => openProject(project.id)}/></td>
                            </tr>)
                    }
                </tbody>
            </table>
        </>
    )
}
