import { Model } from 'objection';
import { ObjectsModel } from './ObjectsModel';
import { ProjectsModel } from './ProjectsModel';
import { UsersModel } from './UsersModel';

export class CommentsModel extends Model {

    $beforeInsert() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate() {
        this.updatedAt = new Date().toISOString();
    }

    static get tableName() {
        return 'comments';
    }

    static get relationMappings() {
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: UsersModel,
                join: {
                    from: 'comments.user_id',
                    to: 'users.id'
                }
            },
            projects: {
                relation: Model.BelongsToOneRelation,
                modelClass: ProjectsModel,
                join: {
                    from: 'comments.project_id',
                    to: 'projects.id'
                }
            },
            objects: {
                relation: Model.BelongsToOneRelation,
                modelClass: ObjectsModel,
                join: {
                    from: 'comments.point_id',
                    to: 'objects.id'
                }
            }
        }
    }
}