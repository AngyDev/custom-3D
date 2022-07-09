const { v4 } = require("uuid");
const { UsersModel } = require("../models/UsersModel");

class UsersController {
  static getUsers() {
    return UsersModel.query().select().orderBy("created_at");
  }

  static getUserById(id) {
    return UsersModel.query().findById(id);
  }

  static getUserByEmail(email) {
    return UsersModel.query().select().where("email", email);
  }

  static createUser(user) {
    return UsersModel.query().insert({
      id: v4(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
    });
  }

  static updateUser(id, user) {
    return UsersModel.query().patchAndFetchById(id, user);
  }

  static deleteUser(id) {
    return UsersModel.query().deleteById(id);
  }
}

module.exports = { UsersController };
