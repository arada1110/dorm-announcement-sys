import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("announcements", (table) => {
        table.increments("id").primary();
        table.uuid("public_id").notNullable().unique();
        table.string("title").notNullable();
        table.text("content").notNullable();
        table.boolean("is_line_notification_enabled").defaultTo(false);
        table.boolean("is_published").defaultTo(true);
        table.integer("dormitory_id");
        table.integer("category_id").notNullable();
        table.uuid("created_by").notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("announcements");
}
