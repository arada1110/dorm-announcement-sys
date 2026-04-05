import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("announcement_categories", (table) => {
        table.increments("id").primary();
        table.string("category_name").notNullable().unique();
        table.text("description").nullable();
        table.boolean("is_active").notNullable().defaultTo(true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("announcement_categories");
}
