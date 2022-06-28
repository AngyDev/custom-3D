const { ObjectsController } = require("../controllers/ObjectsController");
const { ProjectsController } = require("../controllers/ProjectsController");
const { CommentsController } = require("../controllers/CommentsController");
const { errorHandler } = require("../utils");
const { HttpError } = require("../error");
const uploadFile = require("../middleware/upload");
const fs = require("fs");

/**
 * Get Object by id
 */
const getObjectById = errorHandler(async (req, res) => {
  const { id } = req.params;

  const object = await ObjectsController.getObjectById(id);

  return object;
});

/**
 * Get objects file path by project id
 * Not used
 */
const getObjectsPathByProjectId = errorHandler(async (req, res) => {
  const { projectId } = req.params;

  const objects = await ObjectsController.getObjectsPathByProjectId(projectId);

  // TODO: refactor and maybe change the location of the function the same of projects
  const objectsPath = [];

  for (const object of objects) {
    // const path = process.env.AWS_S3_SERVER + "/" + process.env.AWS_BUCKET_NAME + "/" + object["objectPath"];
    const path = `${process.env.FILE_PATH}/public/uploads/${object["objectPath"]}`;
    objectsPath.push(path);
  }

  return objectsPath;
});

/**
 * Get objects by project id
 */
const getObjectsByProjectId = errorHandler(async (req, res) => {
  const { projectId } = req.params;

  const objects = await ObjectsController.getObjectsByProjectId(projectId);

  return objects;
});

/**
 * Deletes object and comments, the comments are deleted by the foreign key
 */
const deleteObject = errorHandler(async (req, res) => {
  const { id } = req.params;

  const object = await ObjectsController.getObjectById(id);

  if (object) {
    fs.unlink(`${process.env.FILE_PATH}/public/uploads/${object["objectPath"]}`, async () => {
      console.log("File deleted");

      const deleteObject = await ObjectsController.deleteObject(id);

      if (deleteObject === 0) {
        throw new HttpError(404, "Object not found");
      }

      return { message: "Object deleted" };
    });
  } else {
    throw new HttpError(404, "Object not found");
  }
});

/**
 * Upload object file and save object
 */
const uploadFileAndSaveObject = errorHandler(async (req, res) => {
  // Checks if the project exist
  const findProject = await ProjectsController.getProjectById(req.params.projectId);

  if (!findProject) throw new HttpError(404, "Project not found");

  // Uploads the file in the server folder
  await uploadFile(req, res);

  if (req.file === undefined) {
    throw new HttpError(400, "Please upload a file!");
  }

  const filepath = req.params.projectId + "/" + req.file.originalname;
  const object = req.body.id;
  const projectId = req.params.projectId;

  // Saves the object in the db
  await ObjectsController.saveObject(object, projectId, filepath);

  return { message: "Uploaded the file successfully: " + req.file.originalname };
});

module.exports = { getObjectById, getObjectsPathByProjectId, deleteObject, uploadFileAndSaveObject, getObjectsByProjectId };
