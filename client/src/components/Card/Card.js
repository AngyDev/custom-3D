import { format } from "date-fns";
import PropTypes from "prop-types";
import React from "react";
import Button from "../Button/Button";
import importIcon from "../../assets/images/icons/black/download-solid-b.svg";

export default function Card({ color, project, onClick, deleteClick, archived, archiveProject }) {
  return (
    <div className="bg-canvas rounded overflow-hidden shadow-md relative hover:shadow-lg">
      <div className={`center w-full h-32 sm:h-38 object-cover ${color ? color : "bg-yellow-400"} p-8 text-justify`}>
        <h1 className="font-bold text-lg">{project.projectName}</h1>
      </div>
      <div className="p-4">
        <span className="font-bold">{project.patientCode}</span>
        <div className="mt-4 mb-4">
          <div className="pb-2">
            <div className="w-full bg-gray-300 rounded-full">
              <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "50%" }}>
                50%
              </div>
            </div>
          </div>
          <span className="block text-gray-500 text-sm">Stato: {project.status}</span>
        </div>
        <div>
          <span>
            Created by: {project.firstName} {project.lastName}
          </span>
        </div>
        <div className="py-4">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="flex flex-wrap justify-between">
          <span>Created at: {format(new Date(project.createdAt), "dd/MM/yyyy")}</span>
          <span>Last update: {format(new Date(project.updatedAt), "dd/MM/yyyy")}</span>
        </div>
        <div className="mt-4 flex justify-between">
          <Button text="Apri" title="Apri" onClick={onClick} />
          <div className="flex items-center gap-2">
            {!archived && <img className="w-4 h-4 cursor-pointer" src={importIcon} alt="Import" onClick={archiveProject} />}
            <span className="delete" onClick={deleteClick}></span>
          </div>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  color: PropTypes.string,
  project: PropTypes.object,
  onClick: PropTypes.func,
  deleteClick: PropTypes.func,
  archiveProject: PropTypes.func,
  archived: PropTypes.bool,
};
