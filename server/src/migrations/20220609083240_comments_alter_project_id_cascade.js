exports.up = function (knex) {
  return knex.schema.alterTable("comments", (table) => {
    table.dropForeign("project_id");
    table
      .foreign("project_id")
      .references("projects.id")
      .onDelete("CASCADE"); // If Project is deleted, delete Comment as well.
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("comments", (table) => {
    table.dropForeign("project_id");

    table
      .foreign("project_id")
      .references("projects.id")
      .onDelete("NO ACTION");
  });
};
