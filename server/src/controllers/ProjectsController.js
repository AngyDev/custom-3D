const { v4 } = require('uuid');
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
        return ProjectsModel.query().findById(id).orderBy('created_at');
    }

    /**
     * Get the projects by user id
     * @param {String} userId User ID
     * @returns The list of projects by user id
     */
    // TODO: Some fileds are missing
    static getProjectsByUserId(userId) {
        return ProjectsModel.query().select(['projects.id', 'projects.project_name', 'projects.patient_code', 'projects.status']).where('projects.user_id', userId)
    }

    /**
     * Insert a project in the DB
     * @param {Object} payload Project
     * @returns The project inserted
     */
    static createProject(payload) {
        return ProjectsModel.query().insert({
            id: v4(),
            project_name: payload.project_name,
            patient_code: payload.patient_code,
            status: payload.status,
            scene: payload.scene,
            assigned_at: payload.assigned_at,
            user_id: payload.user_id
        })
    }

    /**
     * Update the project by id
     * @param {String} id Project ID
     * @param {Object} scene Updated fields
     * @returns 
     */
    static updateProjectScene(id, scene) {
        return ProjectsModel.query().patchAndFetchById(id, { scene: scene });
    }

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