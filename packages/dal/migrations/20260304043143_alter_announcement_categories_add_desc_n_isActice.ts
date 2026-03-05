import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("announcement_categories", (table) => {
        table.text("description").nullable();
        table.boolean("is_active").notNullable().defaultTo(true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("announcement_categories", (table) => {
        table.dropColumn("description");
        table.dropColumn("is_active");
    });
}
