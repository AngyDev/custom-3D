import express from 'express';
import { ObjectsController } from '../controllers/ObjectsController';
import { ProjectsController } from '../controllers/ProjectsController';

const router = express.Router();

/**
 * Get Object by id
 */
router.get('/object/:objectId', async(req, res) => {
    try {
        const objectId = req.params.objectId;
        const response = await ObjectsController.getObjectById(objectId);

        if (response) {
            res.send(response);
        } else {
            res.status(404).send('Not found');
        }

    } catch (error) {
        console.error(error);
    }
});

/**
 * Get objects by project id
 */
router.get('/objects/:projectId/', async(req, res) => {
    try {
        const projectId = req.params.projectId;
        const response = await ObjectsController.getObjectsByProjectId(projectId);

        if (response) {
            res.send(response);
        } else {
            res.status(404).send('Not found');
        }

    } catch (error) {
        console.error(error);
    }
});

/**
 * Save object
 */
router.post('/object', async(req, res) => {
    try {
        const findProject = ProjectsController.getProjectById(req.body.project_id);

        if (!findProject) return res.status(404).send('Project not found');

        const createObject = await ObjectsController.createObject(req.body);
        return res.status(200).json(createObject);

    } catch (error) {
        res.status(400).json(error.message);
        console.error(error);
    }
})

module.exports = router;