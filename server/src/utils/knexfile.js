const { knexSnakeCaseMappers } = require('objection');
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const defaults = {
    client: 'pg',
    debug: true,
    connection: {
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD
    },
    ...knexSnakeCaseMappers()
}

module.exports = {
    local: {
        ...defaults,
        useNullAsDefault: true,
        migrations: {
            directory: '../migrations',
        },
        seeds: {
            directory: '../seeds',
        },
    },
    development: {
        ...defaults,
        migrations: {
            directory: '../migrations'
        },
        seeds: {
            directory: '../seeds',
        },
        useNullAsDefault: true
    }
}