import express from 'express';
import { ObjectsController } from '../controllers/ObjectsController';
import { ProjectsController } from '../controllers/ProjectsController';
const uploadFile = require('../middleware/upload');

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
            // response return the objectPath field
            //res.download(response[0]["objectPath"]);
        } else {
            res.status(404).send('Not found');
        }

    } catch (error) {
        console.error(error);
    }
});

/**
 * Upload object file
 */
router.post('/upload/:projectId', async (req, res) => {
    try {
        // Checks if the project exist
        const findProject = await ProjectsController.getProjectById(req.params.projectId);

        if (!findProject) return res.status(404).send('Project not found');

        // Uploads the file in the server folder
        await uploadFile(req, res);

        if (req.file === undefined) {
            return res.status(400).send({ message: 'Please upload a file!' });
        }

        console.log(req.body);

        const filepath = req.file.path;
        const objectId = req.body.id;
        const projectId = req.params.projectId;

        // Saves the object in the db
        await ObjectsController.saveObject(objectId, projectId, filepath);

        res.status(200).send({
            message: 'Uploaded the file successfully: ' + req.file.originalname
        });
        
    } catch (error) {
        console.error(error);

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${error}`
        });
    }
});

/**
 * Save object
 */
router.post('/object', async(req, res) => {
    try {
        const findProject = await ProjectsController.getProjectById(req.body.project_id);

        if (!findProject) return res.status(404).send('Project not found');

        const createObject = await ObjectsController.createObject(req.body);
        return res.status(200).json(createObject);

    } catch (error) {
        res.status(400).json(error.message);
        console.error(error);
    }
});

/**
 * Deletes object and comments
 */
router.delete("/object/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const deleteObject = await ObjectsController.deleteObject(id);
        res.send("The object sucessfully deleted");
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;