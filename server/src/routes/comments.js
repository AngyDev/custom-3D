import express from 'express';
const api = require("../api/comments");

const router = express.Router();

router.get('/comments/:projectId/:pointId', api.getCommentsByProjectIdAndPointId);
router.post('/comment', api.createComment);

module.exports = router;