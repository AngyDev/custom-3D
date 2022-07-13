const { Model } = require("objection");
const { UsersModel } = require("./UsersModel");

class TokenModel extends Model {
  $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }

  static get tableName() {
    return "token";
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: UsersModel,
        join: {
          from: "token.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = { TokenModel };
