const { ProjectsController } = require("../controllers/ProjectsController");
const { ObjectsController } = require("../controllers/ObjectsController");
const { validateProject } = require("../validation/validate");
const { errorHandler } = require("../utils");
const { HttpError } = require("../error");
const fs = require("fs");

/**
 * Get projects
 */
const getProjects = errorHandler(async (req, res) => {
  const projects = await ProjectsController.getProjects();

  return projects;
});

/**
 * Get project and objects by id
 */
const getProjectById = errorHandler(async (req, res) => {
  const { id } = req.params;

  const project = await ProjectsController.getProjectById(id);

  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  const objects = await ObjectsController.getObjectsPathByProjectId(id);
  const objectsPath = [];

  for (const object of objects) {
    const path = "uploads/" + object["objectPath"];
    objectsPath.push(path);
  }

  return {
    project,
    objectsPath,
  };
});

/**
 * Get project by userId
 */
const getProjectsByUserId = errorHandler(async (req, res) => {
  const userId = req.params.userId;
  const projects = await ProjectsController.getProjectsByUserId(userId);

  return projects;
});

/**
 * Creates project
 */
const createProject = errorHandler(async (req, res) => {
  const project = req.body;

  // Validate the body input
  validateProject(project);

  // TODO: Cheks if the project already exists?

  // Create the project
  const createProject = await ProjectsController.createProject(project);

  return createProject;
});

/**
 * Update project
 */
const updateProject = errorHandler(async (req, res) => {
  const { id } = req.params;
  const project = req.body;

  // 20/06/22 Issue #174 Commented the validation because I can update only the updated_at field and send from the FE an empty object
  // Validate the body input
  // validateProject(project);

  // Checks if the project exists
  const oldProject = await ProjectsController.getProjectById(id);

  if (!oldProject) {
    throw new HttpError(404, "Project not found");
  }

  // Update the project
  const updateProject = await ProjectsController.updateProject(id, project);

  return updateProject;
});

/**
 * Delete project and the other objects and comments related to it and the associated files
 */
const deleteProject = errorHandler(async (req, res) => {
  const { id } = req.params;

  const deletedProject = await ProjectsController.deleteProject(id);

  if (deletedProject === 0) {
    throw new HttpError(404, "Project not found");
  } else {
    fs.rm(`${process.env.FILE_PATH}/public/uploads/${id}`, { recursive: true, force: true }, async () => {
      console.log("File deleted");
    });

    return { message: "Project deleted" };
  }
});

module.exports = { getProjects, getProjectById, getProjectsByUserId, createProject, updateProject, deleteProject };
