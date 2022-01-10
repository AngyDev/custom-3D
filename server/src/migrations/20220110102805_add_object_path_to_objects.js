exports.up = function (knex) {
  return knex.schema.table("objects", (table) => {
    table.string("object_path").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table("objects", (table) => {
    table.dropColumn("object_path");
  });
};
