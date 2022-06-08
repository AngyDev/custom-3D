import React from "react";
import { useHistory } from "react-router";
import useGetProjectsByUserId from "../../../hooks/useGetProjectsByUserId";
import Card from "../../Card/Card";

export default function Projects() {
  const { projects } = useGetProjectsByUserId();
  const history = useHistory();

  const openProject = (id) => {
    history.push(`/editor/${id}`);
  };

  return (
    <div className="container-component bg-baseLight dark:bg-base h-screen">
      {Object.keys(projects).length > 0 ? (
        <div className="grid desktop:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project) => (
            <Card key={project.id} project={project} onClick={() => openProject(project.id)} />
          ))}
        </div>
      ) : (
        <h2 className="text-center text-white">No projects</h2>
      )}
    </div>
  );
}
