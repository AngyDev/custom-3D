const { v4 } = require("uuid");
const { ProjectsModel } = require("../models/ProjectsModel");

class ProjectsController {
  /**
   * Get projects
   * @returns List of projects
   */
  static getProjects() {
    return ProjectsModel.query().select().orderBy("created_at");
  }

  /**
   * Get project by id
   * @param {String} id Projects ID
   * @returns Project by id
   */
  static getProjectById(id) {
    return ProjectsModel.query().findById(id);
  }

  /**
   * Get the projects by user id
   * @param {String} userId User ID
   * @returns The list of projects by user id and assigned to the userId
   */
  // TODO: Some fields are missing
  static getProjectsByUserId(userId, archived) {
    return ProjectsModel.query()
      .join("users", "projects.user_id", "users.id")
      .select(["projects.*", "users.first_name", "users.last_name"])
      .whereRaw("? = any(??)", [userId, "projects.assigned_at"])
      .orWhere("projects.user_id", userId)
      .where("projects.archived", archived)
      .orderBy("projects.created_at");
  }

  /**
   * Insert a project in the DB
   * @param {Object} payload Project
   * @returns The project inserted
   */
  static createProject(payload) {
    return ProjectsModel.query().insert({
      id: v4(),
      project_name: payload.projectName,
      patient_code: payload.patientCode,
      status: payload.status,
      assigned_at: payload.assignedAt,
      user_id: payload.userId,
      archived: payload.archived,
      locked: payload.locked,
    });
  }

  /**
   * Update the project by id
   * @param {String} id Project ID
   * @param {Object} payload Updated fields
   * @returns
   */
  static updateProject(id, payload) {
    return ProjectsModel.query().updateAndFetchById(id, payload);
  }

  /**
   * Delete the project by id
   * @param {String} id Project ID
   * @returns Deleted message
   */
  static deleteProject(id) {
    return ProjectsModel.query().deleteById(id);
  }
}

module.exports = { ProjectsController };
