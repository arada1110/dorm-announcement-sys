import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("announcements", (table) => {
        table.boolean("is_line_sent").defaultTo(false);
        table.timestamp("line_sent_at").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("announcements", (table) => {
        table.dropColumn("is_line_sent");
        table.dropColumn("line_sent_at");
    });
}
