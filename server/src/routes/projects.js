const express = require("express");
const api = require("../api/projects");

const router = express.Router();

router.get("/projects", api.getProjects);
router.get("/project/:id", api.getProjectById);
router.get("/project-user/:userId", api.getProjectByUserId);
router.post("/project", api.createProject);
router.put("/project/:id", api.updateProject);
router.delete("/project/:id", api.deleteProject);

module.exports = router;
