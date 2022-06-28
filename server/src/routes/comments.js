const express = require('express');
const api = require("../api/comments");

const router = express.Router();

router.get('/comments/:projectId/:pointId', api.getCommentsByProjectIdAndPointId);
router.get('/comments/:projectId', api.getCommentsByProjectId);
router.post('/comment', api.createComment);
router.delete('/comment/:id', api.deleteComment);

module.exports = router;