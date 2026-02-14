import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("line_notification_logs", (table) => {
        table.increments("id").primary();
        table.integer("announcement_id");
        table.uuid("user_id").notNullable();
        table.timestamp("sent_at").defaultTo(knex.fn.now());
        table.string("status").notNullable();
        table.text("error_message");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("line_notification_logs");
}
