exports.up = function(knex) {
  return knex.schema.alterTable("token", (table) => {
    table.dropForeign("user_id");
    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("CASCADE"); // If Users is deleted, delete token as well.
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("token", (table) => {
    table.dropForeign("user_id");

    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("NO ACTION");
  });
};