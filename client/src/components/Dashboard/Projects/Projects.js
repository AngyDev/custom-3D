import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useGetProjectsByUserId from "../../../hooks/useGetProjectsByUserId";
import Card from "../../Card/Card";
import Alert from "../../Alert/Alert";

export default function Projects() {
  const { projects } = useGetProjectsByUserId();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!projects) {
      setError(true);
      setOpen(true);
    }
  }, [projects]);

  const openProject = (id) => {
    history.push(`/editor/${id}`);
  };

  return (
    <div className="container-component bg-baseLight dark:bg-base h-screen">
      {error ? (
        <Alert text="Error loading data" open={open} onClose={() => setOpen(false)} />
      ) : (
        <div className="grid desktop:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {Object.keys(projects).length > 0 &&
            projects.map((project) => <Card key={project.id} project={project} onClick={() => openProject(project.id)} />)}
        </div>
      )}
    </div>
  );
}
