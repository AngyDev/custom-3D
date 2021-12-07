import { Model } from 'objection';
import { UsersModel } from './UsersModel';

export class ProjectsModel extends Model {

    $beforeInsert() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static get tableName() {
        return 'projects';
    }

    static get relationMappings() {
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: UsersModel,
                join: {
                    from: 'projects.user_id',
                    to: 'users.id'
                }
            }
        }
    }
}