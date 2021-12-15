import express from 'express';
import { CommentsController } from '../controllers/CommentsController';
import { ProjectsController } from '../controllers/ProjectsController';
import { UsersController } from '../controllers/UsersControllers';

const router = express.Router();

/**
 * Get comments by project id and point id
 */
router.get('/comments/:projectId/:pointId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const pointId = req.params.pointId;
        const response = await CommentsController.getCommentsByProjectIdAndPointId(projectId, pointId);

        if (response) {
            res.send(response);
        } else {
            res.status(404).send('Not found');
        }

    } catch (error) {
        console.error(error);
    }
});

router.post('/comment', async (req, res) => {
    try {
        const findUser = UsersController.getUserById(req.body.user_id);
        const findProject = ProjectsController.getProjectById(req.body.project_id);

        if (!findUser) return res.status(404).send('User not found');
        if (!findProject) return res.status(404).send('Project not found');

        const createComment = await CommentsController.createComment(req.body);
        const response = await CommentsController.getCommentsByProjectIdAndPointId(req.body.project_id, req.body.point_id);
        return res.status(200).json(response);

    } catch (error) {
        res.status(400).json(error.message);
        console.error(error);
    }
})

module.exports = router;