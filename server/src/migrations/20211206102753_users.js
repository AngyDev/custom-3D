exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
        table.string('id').primary();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('email').unique();
        table.string('password').notNullable();
        table.string('role').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users');
};