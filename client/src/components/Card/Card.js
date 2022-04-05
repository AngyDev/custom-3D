import React from "react";
import Button from "../Button/Button";
import PropTypes from "prop-types";
import moment from "moment";

export default function Card({ color, project, onClick }) {
  return (
    <div className="bg-white rounded overflow-hidden shadow-md relative hover:shadow-lg">
      <div className={`center w-full h-32 sm:h-38 object-cover ${color ? color : "bg-yellow-400"} p-8 text-justify`}>
        <h1 className="font-bold text-lg">{project.projectName}</h1>
      </div>
      <div className="m-4">
        <span className="font-bold">{project.patientCode}</span>
        <div className="mt-4 mb-4">
          <div className="pb-2">
            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
              <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "50%" }}>
                50%
              </div>
            </div>
          </div>
          <span className="block text-gray-500 text-sm">Stato: {project.status}</span>
        </div>
        <div>
          <span>
            Creato da: {project.firstName} {project.lastName}
          </span>
        </div>
        <div className="py-4">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="flex flex-wrap justify-between">
          <span>Ultima modifica: {moment(project.createdAt).format("DD/MM/YYYY")}</span>
          <span>Ultima visita: {moment(project.updatedAt).format("DD/MM/YYYY")}</span>
        </div>
        <div className="mt-4">
          <Button text="Apri" title="Apri" onClick={onClick} />
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  color: PropTypes.string,
  project: PropTypes.object,
  onClick: PropTypes.func,
};
