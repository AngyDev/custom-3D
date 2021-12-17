import { Model } from 'objection';
import { CommentsModel } from "./CommentsModel";
import { ProjectsModel } from "./ProjectsModel";

export class ObjectsModel extends Model {

    $beforeInsert() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate() {
        this.updatedAt = new Date().toISOString();
    }

    static get tableName() {
        return 'objects';
    }

    static get relationMappings() {
        return {
            projects: {
                relation: Model.BelongsToOneRelation,
                modelClass: ProjectsModel,
                join: {
                    from: 'objects.project_id',
                    to: 'projects.id'
                }
            },
            comments: {
                relation: Model.HasManyRelation,
                modelClass: CommentsModel,
                join: {
                    from: 'objects.id',
                    to: 'comments.point_id'
                }
            }
        }
    }
}