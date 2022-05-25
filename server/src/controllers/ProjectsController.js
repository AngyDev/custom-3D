const { v4 } = require("uuid");
import { ProjectsModel } from "../models/ProjectsModel";

export class ProjectsController {
  /**
   * Get projects
   * @returns List of projects
   */
  static getProjects() {
    return ProjectsModel.query().select().orderBy('created_at');
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
   * @returns The list of projects by user id
   */
  // TODO: Some fields are missing
  static getProjectsByUserId(userId) {
    return ProjectsModel.query()
      .join("users", "projects.user_id", "users.id")
      .select(["projects.*", "users.first_name", "users.last_name"])
      .where("projects.user_id", userId)
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
