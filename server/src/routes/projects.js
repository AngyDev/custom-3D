import express from "express";
import { ObjectsController } from "../controllers/ObjectsController";
import { ProjectsController } from "../controllers/ProjectsController";

const router = express.Router();

/**
 * Get projects
 */
router.get("/projects", async (req, res) => {
  try {
    const response = await ProjectsController.getProjects();

    if (response) {
      res.send(response);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    console.error(error);
  }
});

/**
 * Get project and objects by id
 */
router.get("/project/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const project = await ProjectsController.getProjectById(id);
    const objects = await ObjectsController.getObjectsByProjectId(id);

    const objectsPath = [];

    for (const object of objects) {
      const path = process.env.AWS_S3_SERVER + "/" + process.env.AWS_BUCKET_NAME + "/" + object["objectPath"];
      objectsPath.push(path);
    }

    return res.status(200).json({
      project,
      objectsPath,
    });
  } catch (error) {
    console.error(error);
  }
});

/**
 * Get project by userId
 */
router.get("/project-user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const response = await ProjectsController.getProjectsByUserId(userId);

    if (response) {
      res.send(response);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    console.error(error);
  }
});

/**
 * Create project
 */
router.post("/project", async (req, res) => {
  try {
    const project = req.body;
    const createProject = await ProjectsController.createProject(project);
    return res.status(200).json(createProject);
  } catch (error) {
    res.status(400).json(error.message);
    console.error(error);
  }
});

/**
 * Update project
 */
router.put("/project/:id", async (req, res) => {
  try {
    const response = await ProjectsController.updateProject(req.params.id, req.body);
    if (response) res.status(200).json(response);
    else res.status(404).send("Project not found");
  } catch (error) {
    res.status(400).json(error.message);
    console.error(error);
  }
});

/**
 * Delete project
 */
router.delete("/project/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleteProject = await ProjectsController.deleteProject(id);
    res.json("Project was deleted");
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
