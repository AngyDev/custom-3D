
const faker = require('faker');

// TODO: Don't work
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  await knex('users').insert([
    {
      id: 1,
      first_name: "Angela",
      last_name: "Busato",
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "Engeener"
    },
    {
      id: faker.datatype.uuid(),
      first_name: faker.name.firstName,
      last_name: faker.name.lastName,
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "Doctor"
    },
    {
      id: faker.datatype.uuid(),
      first_name: faker.name.firstName,
      last_name: faker.name.lastName,
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "Engeener"
    }
  ]);
};
