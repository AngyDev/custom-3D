exports.up = function(knex) {
    return knex.schema.table('objects', table => {
        table.dropColumn('object_id');
    })
};

exports.down = function(knex) {
    return knex.schema.table('objects', table => {
        table.string('object_id').notNullable();
    })
};