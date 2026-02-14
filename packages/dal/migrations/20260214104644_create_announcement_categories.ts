import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("announcement_categories", (table) => {
        table.increments("id").primary();
        table.string("category_name").notNullable().unique();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("announcement_categories");
}
