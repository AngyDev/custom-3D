
exports.up = function(knex) {
  return knex.schema.createTable('token', (table) => {
    table.string('id').primary();
    table.string('user_id').references('users.id');
    table.string('token').unique().notNullable();
    table.timestamp('expired_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
})
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('token');
};