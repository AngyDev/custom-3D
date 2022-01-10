exports.up = function (knex) {
  return knex.schema.table("projects", (table) => {
    table.dropColumn("scene");
  });
};

exports.down = function (knex) {
  return knex.schema.table("objects", (table) => {
    table.json("scene").nullable();
  });
};
