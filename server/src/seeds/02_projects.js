
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('projects').del();

  await knex('projects').insert([
    {
      id: faker.datatype.uuid(),
      user_id: 1,
      project_name: "First Project",
      patient_code: "Bones1234"
    }
  ]);
};
