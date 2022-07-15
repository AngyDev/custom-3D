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
            {projects.map((project) => (
              <Card key={project.id} project={project} onClick={() => openProject(project.id)} deleteClick={() => handleDelete(project.id)} />
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
