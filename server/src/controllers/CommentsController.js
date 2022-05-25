import { CommentsModel } from "../models/CommentsModel";
const { v4 } = require("uuid");

export class CommentsController {
  /**
   * Get comments by project id
   * @param {String} projectId Project ID
   * @returns list of comments by project id
   */
  static getCommentsByProjectId(projectId) {
    return CommentsModel.query().select("comments.*").where("comments.project_id", projectId);
  }

  /**
   * Get comments by projectId and pointId
   * @param {String} projectId Project ID
   * @param {String} pointId Point ID
   * @returns List of comments by projectsId and pointId
   */
  static getCommentsByProjectIdAndPointId(projectId, pointId) {
    return CommentsModel.query()
      .select(["comments.*", "users.first_name", "users.last_name"])
      .join("users", "users.id", "comments.user_id")
      .where("comments.project_id", projectId)
      .where("comments.point_id", pointId)
      .orderBy("created_at", "ASC");
  }

  /**
   * Insert the comment in the DB
   * @param {Object} comment
   * @returns The comment inserted
   */
  static createComment(comment) {
    return CommentsModel.query().insert({
      id: v4(),
      text: comment.text,
      project_id: comment.projectId,
      user_id: comment.userId,
      point_id: comment.pointId,
    });
  }

  /**
   * Delete the comment by id
   * @param {String} id 
   */
  static deleteComment(id) {
    return CommentsModel.query().deleteById(id);
  }
}
