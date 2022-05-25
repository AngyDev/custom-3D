const { ObjectsController } = require("../controllers/ObjectsController");
const { ProjectsController } = require("../controllers/ProjectsController");
const { errorHandler } = require("../utils");
const { HttpError } = require("../error");

/**
 * Get Object by id
 */
const getObjectById = errorHandler(async (req, res) => {
  const { id } = req.params;

  const object = await ObjectsController.getObjectById(id);

  return object;
});

/**
 * Get objects by project id
 */
const getObjectsPathByProjectId = errorHandler(async (req, res) => {
  const { projectId } = req.params;

  const objects = await ObjectsController.getObjectsPathByProjectId(projectId);

  // TODO: refactor and maybe change the location of the function the same of projects
  const objectsPath = [];

  for (const object of objects) {
    const path = process.env.AWS_S3_SERVER + "/" + process.env.AWS_BUCKET_NAME + "/" + object["objectPath"];
    objectsPath.push(path);
  }

  return objectsPath;
});

const createObject = errorHandler(async (req, res) => {
  // const { projectId } = req.params;
  // const findProject = await ProjectsController.getProjectById(projectId);
  // if (!findProject) throw new HttpError(404, "Project not found");
  // const createObject = await ObjectsController.createObject();
});

/**
 * Deletes object and comments
 */
const deleteObject = errorHandler(async (req, res) => {
  const { id } = req.params;

  const deleteObject = await ObjectsController.deleteObject(id);

  if (deleteObject === 0) {
    throw new HttpError(404, "Object not found");
  }

  return { message: "Object deleted" };
});

module.exports = { getObjectById, getObjectsPathByProjectId, createObject, deleteObject };
