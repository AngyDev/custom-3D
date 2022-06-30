const { ObjectsModel } = require("../models/ObjectsModel");

class ObjectsController {
  /**
   * Gets the object by uuid
   * @param {String} objectId The uuid of the object
   * @returns The object by uuid
   */
  static getObjectById(id) {
    return ObjectsModel.query().findById(id);
  }

  /**
   * Gets the list of objects of a project
   * @param {String} projectId Project ID
   * @returns List of objects by project id only json field
   */
  static getObjectsPathByProjectId(projectId) {
    return ObjectsModel.query().select("objects.object_path").where("objects.project_id", projectId);
  }

  static getObjectsByProjectId(projectId) {
    return ObjectsModel.query().select().where("objects.project_id", projectId);
  }

  /**
   * Saves the object on the db
   * @param {Object} object
   * @returns The object inserted
   * Method Not used
   */
  static createObject(object) {
    return ObjectsModel.query().insert({
      id: object.objectId,
      project_id: object.projectId,
      object: object.object,
    });
  }

  /**
   * Saves the object in the db
   * @param {Object} object The id of the mesh
   * @param {String} projectId
   * @param {String} filepath
   * @returns
   */
  static saveObject(objectId, objectName, projectId, filepath) {
    return ObjectsModel.query().insert({
      id: objectId,
      project_id: projectId,
      object_name: objectName,
      object_path: filepath,
    });
  }

  static deleteObject(id) {
    return ObjectsModel.query().deleteById(id);
  }
}

module.exports = { ObjectsController };
