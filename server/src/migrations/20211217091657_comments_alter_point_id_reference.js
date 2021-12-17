exports.up = function(knex) {
    return knex.schema.alterTable('comments', (table) => {
        table.string('point_id').references('objects.id').alter();
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('comments', (table) => {
        table.string('point_id').notNullable().alter();
    });
};