
exports.up = function(knex) {
  return knex.schema.createTable('projects', (table) => {
      table.string('id').primary();
      table.string('project_name').notNullable();
      table.string('patient_code').notNullable();
      table.string('status').nullable().defaultTo("start");
      table.json('scene').nullable();
      table.specificType('assigned_at', 'TEXT[]').nullable();
      table.string('user_id').references('users.id');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('projects');
};
