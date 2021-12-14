
exports.up = function (knex) {
    return knex.schema.createTable('comments', (table) => {
        table.string('id').primary();
        table.string('point_id').notNullable();
        table.string('text').notNullable();
        table.string('user_id').references('users.id')
        table.string('project_id').references('projects.id');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('comments');
};
