exports.up = function (knex) {
  return knex.schema.table("objects", (table) => {
    table.renameColumn("object", "object_name");
  });
};

exports.down = function (knex) {
  return knex.schema.table("objects", (table) => {
    table.renameColumn("object_name", "object");
  });
};