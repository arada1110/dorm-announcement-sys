import { Knex, knex } from "knex";

export const db: Knex = knex({
    client: process.env.DATABASE__DRIVER,
    connection: {
        host: process.env.DATABASE__HOST,
        port: Number(process.env.DATABASE__PORT),
        user: process.env.DATABASE__USER,
        password: process.env.DATABASE__PASSWORD,
        database: process.env.DATABASE__DATABASE,
    },
    pool: {
        min: parseInt(process.env.DATABASE__POOL_MIN || "1"),
        max: parseInt(process.env.DATABASE__POOL_MAX || "1"),
    },
});
