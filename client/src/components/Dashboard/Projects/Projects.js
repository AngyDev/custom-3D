import React from 'react';
import useGetProjectsByUserId from '../../../hooks/useGetProjectsByUserId';

export default function Projects() {

    const { projects } = useGetProjectsByUserId();

    return (
        <>
            <table id="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Patient Code</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(projects).length > 0 && projects.map((project, i) =>
                            <tr key={project.id}>
                                <td>{project.projectName}</td>
                                <td>{project.patientCode}</td>
                                <td>{project.status}</td>
                            </tr>)
                    }
                </tbody>
            </table>
        </>
    )
}
