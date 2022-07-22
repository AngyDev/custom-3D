exports.up = function (knex) {
  return knex.schema.table("projects", (table) => {
    table.string("locked").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table("projects", (table) => {
    table.dropColumn("locked");
  });
};
