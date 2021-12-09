const { knexSnakeCaseMappers } = require('objection');

const defaults = {
    client: 'pg',
    debug: true,
    connection: {
        host: 'localhost',
        port: '5432',
        database: 'custom3d',
        user: 'postgres',
        password: 'password'
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