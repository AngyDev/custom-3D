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
    <div className="container-component bg-base h-screen">
      <div className="grid desktop:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {Object.keys(projects).length > 0 &&
          projects.map((project) => <Card key={project.id} project={project} onClick={() => openProject(project.id)} />)}
      </div>
    </div>
  );
}
