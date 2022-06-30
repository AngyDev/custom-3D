exports.up = function (knex) {
  return knex.schema.alterTable("objects", (table) => {
    table.string("object_name").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("objects", (table) => {
    table.json("object_name").alter();
  });
};