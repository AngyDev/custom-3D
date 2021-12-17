import { Model } from 'objection';
import { CommentsModel } from './CommentsModel';
import { ProjectsModel } from './ProjectsModel';

export class UsersModel extends Model {

    $beforeInsert() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate() {
        this.updatedAt = new Date().toISOString();
    }

    static get tableName() {
        return 'users';
    }

    static get relationMappings() {
        return {
            projects: {
                relation: Model.HasManyRelation,
                modelClass: ProjectsModel,
                join: {
                    from: 'users.id',
                    to: 'projects.user_id'
                }
            },
            comments: {
                relation: Model.HasManyRelation,
                modelClass: CommentsModel,
                join: {
                    from: 'users.id',
                    to: 'comments.user_id'
                }
            }
        }
    }
}