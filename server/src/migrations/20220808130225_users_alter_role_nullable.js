exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.string("role").nullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("user", (table) => {
    table.string("role").notNullable().alter();
  });
};