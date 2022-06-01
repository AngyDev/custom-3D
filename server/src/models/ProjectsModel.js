const { Model } = require("objection");
const { CommentsModel } = require("./CommentsModel");
const { ObjectsModel } = require("./ObjectsModel");
const { UsersModel } = require("./UsersModel");

class ProjectsModel extends Model {
  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get tableName() {
    return "projects";
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: UsersModel,
        join: {
          from: "projects.user_id",
          to: "users.id",
        },
      },
      comments: {
        relation: Model.HasManyRelation,
        modelClass: CommentsModel,
        join: {
          from: "projects.id",
          to: "comments.project_id",
        },
      },
      objects: {
        relation: Model.HasManyRelation,
        modelClass: ObjectsModel,
        join: {
          from: "projects.id",
          to: "objects.project_id",
        },
      },
    };
  }
}

module.exports = { ProjectsModel };
