import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { useDeleteProject } from "../../../hooks/useDeleteProject";
import useGetProjectsByUserId from "../../../hooks/useGetProjectsByUserId";
import Card from "../../Card/Card";
import ModalDelete from "../../Modal/ModalDelete";

export default function Projects() {
  const { user } = useAuth();
  const { projects, fetchGetProjectsByUserId } = useGetProjectsByUserId();
  const { fetchDeleteProject } = useDeleteProject();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteElem, setDeleteElem] = useState();
  const color = ["bg-card1", "bg-card2", "bg-card3", "bg-card4", "bg-card5", "bg-card6"];
  const history = useHistory();

  useEffect(() => {
    fetchGetProjectsByUserId(user.id);
  }, []);

  const openProject = (id) => {
    history.push(`/editor/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteElem(id);
    setIsOpen(true);
  };

  const deleteProject = async () => {
    await fetchDeleteProject(deleteElem);

    fetchGetProjectsByUserId();
    setIsOpen(false);
  };

  return (
    <>
      <div className="container-component bg-baseLight dark:bg-base h-screen">
        {Object.keys(projects).length > 0 ? (
          <div className="grid desktop:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, i) => (
              <Card
                key={project.id}
                color={color[i % 6]}
                project={project}
                onClick={() => openProject(project.id)}
                deleteClick={() => handleDelete(project.id)}
              />
            ))}
          </div>
        ) : (
          <h2 className="text-center text-white">No projects</h2>
        )}
      </div>
      <ModalDelete open={isOpen} onClose={() => setIsOpen(false)} onClick={deleteProject} />
    </>
  );
}
