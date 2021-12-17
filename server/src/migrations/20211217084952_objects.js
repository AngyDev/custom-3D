exports.up = function(knex) {
    return knex.schema.createTable('objects', (table) => {
        table.string('id').primary();
        table.string('project_id').references('projects.id');
        table.string('object_id').notNullable();
        table.json('object').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('objects');
};