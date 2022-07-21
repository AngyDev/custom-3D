exports.up = function (knex) {
  return knex.schema.table("projects", (table) => {
    table.boolean("archived").notNullable().defaultTo(false);;
  });
};

exports.down = function (knex) {
  return knex.schema.table("projects", (table) => {
    table.dropColumn("archived");
  });
};
