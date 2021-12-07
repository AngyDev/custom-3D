const { v4 } = require ('uuid');
import { UsersModel } from '../models/UsersModel';

export class UsersController {
    static getUsers() {
        return UsersModel.query().select().orderBy('created_at');
    }

    static getUserById(id) {
        return UsersModel.query().findById(id);
    }

    static createUser(user) {
        return UsersModel.query().insert({
            id: v4(),
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            role: user.role
        })
    }

    static updateUser(id, user) {
        return UsersModel.query().patchAndFetchById(id, user);
    }

    static deleteUser(id) {
        return UsersModel.query().deleteById(id);
    }
}