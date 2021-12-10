import express from 'express';
import { ProjectsController } from '../controllers/ProjectsController';

const router = express.Router();

router.get("/projects", async (req, res) => {
    try {
        const response = await ProjectsController.getProjects();

        if (response) {
            res.send(response);
        } else {
            res.status(404).send('Not found');
        }
    } catch (error) {
        console.error(error);
    }
});

router.get("/project/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const response = await ProjectsController.getProjectById(id);
        
        if (response) {
            res.send(response);
        } else {
            res.status(404).send('Not found');
        }

    } catch (error) {
        console.error(error);
    }
});

router.get("/project-user/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const response = await ProjectsController.getProjectsByUserId(userId);

        if (response) {
            res.send(response);
        } else {
            res.status(404).send('Not found');
        }
    } catch (error) {
        console.error(error);
    }
});

router.post("/project", async (req, res) => {
    try {
        const project = req.body;
        const createProject = await ProjectsController.createProject(project);
        return res.status(200).json(createProject);
    } catch (error) {
        console.error(error);
    }
});

router.post("/project-scene", async (req, res) => {
    try {
        const { id, avatar } = req.body;
        const project = await ProjectsController.getProjectById(id);
        
        if (project) {
            const response = await ProjectsController.updateProjectScene(id, scene);
            if (response) res.send(response)
        } else {
            res.status(404).send('Not found');
        }
    } catch (error) {
        console.error(error);
    }
});

router.delete("/project/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleteProject = await ProjectsController.deleteProject(id);
        res.json("Project was deleted");
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;