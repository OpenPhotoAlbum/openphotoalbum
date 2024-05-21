import dotenv from "dotenv";

import createKnex, { Knex } from 'knex'

dotenv.config({ path: '/home/openphoto/config/.env' });

const knexConfig: Knex.Config = {
    client: 'mysql',
    useNullAsDefault: true,
    connection: {
        host: process.env.MARIA_DB_HOST,
        port: parseInt(process.env.MARIA_DB_PORT),
        user: process.env.MARIA_DB_USER,
        password: process.env.MARIA_DB_PASSWORD,
        database: process.env.MARIA_DB_DATABASE,
        multipleStatements: true,
    }
}

const knex = createKnex(knexConfig)

export default knex;