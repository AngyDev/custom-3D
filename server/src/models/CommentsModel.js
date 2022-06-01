const { Model } = require("objection");
const { ObjectsModel } = require("./ObjectsModel");
const { ProjectsModel } = require("./ProjectsModel");
const { UsersModel } = require("./UsersModel");

class CommentsModel extends Model {
  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get tableName() {
    return "comments";
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: UsersModel,
        join: {
          from: "comments.user_id",
          to: "users.id",
        },
      },
      projects: {
        relation: Model.BelongsToOneRelation,
        modelClass: ProjectsModel,
        join: {
          from: "comments.project_id",
          to: "projects.id",
        },
      },
      objects: {
        relation: Model.BelongsToOneRelation,
        modelClass: ObjectsModel,
        join: {
          from: "comments.point_id",
          to: "objects.id",
        },
      },
    };
  }
}

module.exports = { CommentsModel };
