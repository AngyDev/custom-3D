exports.up = function (knex) {
  return knex.schema.alterTable("objects", (table) => {
    table.dropForeign("project_id");
    table
      .foreign("project_id")
      .references("projects.id")
      .onDelete("CASCADE"); // If Project is deleted, delete Object as well.
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("objects", (table) => {
    table.dropForeign("project_id");

    table
      .foreign("project_id")
      .references("projects.id")
      .onDelete("NO ACTION");
  });
};
