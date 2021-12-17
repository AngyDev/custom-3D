import { Model } from 'objection';
import { CommentsModel } from './CommentsModel';
import { ObjectsModel } from './ObjectsModel';
import { UsersModel } from './UsersModel';

export class ProjectsModel extends Model {

    $beforeInsert() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate() {
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
            },
            comments: {
                relation: Model.HasManyRelation,
                modelClass: CommentsModel,
                join: {
                    from: 'projects.id',
                    to: 'comments.project_id'
                }
            },
            objects: {
                relation: Model.HasManyRelation,
                modelClass: ObjectsModel,
                join: {
                    from: 'projects.id',
                    to: 'objects.project_id'
                }
            }
        }
    }
}