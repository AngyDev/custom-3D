exports.up = function(knex) {
    return knex.schema.alterTable('comments', (table) => {
        table.dropForeign('point_id');
        table
            .foreign('point_id')
            .references('objects.id')
            .onDelete('CASCADE'); // If Object is deleted, delete Comment as well.
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('comments', (table) => {
        table.dropForeign('point_id');

        table
            .foreign('point_id')
            .references('objects.id')
            .onDelete('NO ACTION');
    });
};