const { errorHandler } = require("../utils");
const { HttpError } = require("../error");
const { CommentsController } = require("../controllers/CommentsController");
const { ObjectsController } = require("../controllers/ObjectsController");
const { ProjectsController } = require("../controllers/ProjectsController");
const { UsersController } = require("../controllers/UsersController");

/**
 * Get comments by project id and point id
 */
const getCommentsByProjectIdAndPointId = errorHandler(async (req, res) => {
  const { projectId, pointId } = req.params;

  const comments = await CommentsController.getCommentsByProjectIdAndPointId(projectId, pointId);

  return comments;
});

/**
 * Save comment
 */
const createComment = errorHandler(async (req, res) => {
  const { userId } = req.body;
  const { projectId } = req.body;
  const { pointId } = req.body;

  const findUser = UsersController.getUserById(userId);
  const findProject = ProjectsController.getProjectById(projectId);
  // Cheacks if the object exists in the project
  const objects = await ObjectsController.getObjectsByProjectId(projectId);
  const object = objects.find((object) => object.id === pointId);

  if (!findUser) throw new HttpError(404, "User not found");
  if (!findProject) throw new HttpError(404, "Project not found");
  if (!object) throw new HttpError(404, "Object not found");

  const createComment = await CommentsController.createComment(req.body);

  if (!createComment) throw new HttpError(400, "Comment not created");

  return { message: "Comment created" };
});

const deleteComment = errorHandler(async (req, res) => {
  const { id } = req.params;

  const deleteComment = await CommentsController.deleteComment(id);

  console.log(deleteComment);

  if (!deleteComment) {
    throw new HttpError(400, "Comment not deleted");
  } else {
    return { message: "Comment deleted" };
  }
});

module.exports = { getCommentsByProjectIdAndPointId, createComment, deleteComment };
