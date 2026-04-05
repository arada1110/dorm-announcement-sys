import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("admin_dormitories", (table) => {
        table.increments("id").primary();
        table.uuid("user_id").notNullable();
        table.integer("dormitory_id").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("admin_dormitories");
}
