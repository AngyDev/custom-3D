import { Model } from 'objection'; 

export class UsersModel extends Model {

    $beforeInsert() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static get tableName() {
        return 'users';
    }

}