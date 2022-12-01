import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { useDeleteProject } from "../../../hooks/useDeleteProject";
import useGetProjectsByUserId from "../../../hooks/useGetProjectsByUserId";
import Card from "../../atoms/Card/Card";
import ModalDelete from "../../Modal/ModalDelete";
import { getProjectById, updateProject } from "../../../services/api";
import { useDispatch } from "react-redux";
import { dispatchError } from "../../../features/error/errorSlice";

export default function Projects({ archived }) {
  const { user } = useAuth();
  const { projects, fetchGetProjectsByUserId } = useGetProjectsByUserId();
  const { fetchDeleteProject } = useDeleteProject();
  const history = useHistory();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenArchive, setIsOpenArchive] = useState(false);
  const [selectedProject, setSelectedProject] = useState();
  const color = ["bg-card1", "bg-card2", "bg-card3", "bg-card4", "bg-card5", "bg-card6"];

  useEffect(() => {
    fetchGetProjectsByUserId(user.id, archived);
  }, [archived]);

  const openProject = async (project) => {
    getProjectById(project.id)
      .then((response) => {
        if (response.data.locked !== null && response.data.locked !== user.id) {
          dispatch(dispatchError({ message: "This project is locked by another user" }));
          history.push(`/editor/${project.id}`);
        } else {
          updateProject(project.id, { ...response.data, locked: user.id })
            .then(() => {
              history.push(`/editor/${project.id}`);
            })
            .catch((error) => {
              dispatch(dispatchError(error));
            });
        }
      })
      .catch((error) => {
        dispatch(dispatchError(error));
      });
  };

  const handleModal = (project, type) => {
    setSelectedProject(project);
    type === "delete" ? setIsOpen(true) : setIsOpenArchive(true);
  };

  const deleteProject = async () => {
    await fetchDeleteProject(selectedProject.id);

    fetchGetProjectsByUserId(user.id, archived);
    setIsOpen(false);
  };

  const archiveProject = () => {
    updateProject(selectedProject.id, { ...selectedProject, archived: true })
      .then(() => {
        fetchGetProjectsByUserId(user.id, archived);
        setIsOpenArchive(false);
      })
      .catch((error) => {
        dispatch(dispatchError(error));
      });
  };

  return (
    <>
      <div className="container-component bg-baseLight dark:bg-base h-screen overflow-y-auto" style={{ paddingBottom: "83px" }}>
        {Object.keys(projects).length > 0 ? (
          <div className="grid desktop:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, i) => (
              <Card
                key={project.id}
                color={color[i % 6]}
                project={project}
                onClick={() => openProject(project)}
                deleteClick={() => handleModal(project, "delete")}
                archived={archived}
                archiveProject={() => handleModal(project, "archive")}
              />
            ))}
          </div>
        ) : (
          <h2 className="text-center text-white">No projects</h2>
        )}
      </div>
      <ModalDelete open={isOpen} onClose={() => setIsOpen(false)} onClick={deleteProject} />
      <ModalDelete open={isOpenArchive} onClose={() => setIsOpenArchive(false)} onClick={archiveProject} text="archive" />
    </>
  );
}

Projects.propTypes = {
  archived: PropTypes.bool,
};
