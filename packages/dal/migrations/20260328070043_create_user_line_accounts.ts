import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user_line_accounts", (table) => {
        table.increments("id").primary();
        table.uuid("user_id").notNullable();
        table.string("line_user_id").notNullable().unique();
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("user_line_accounts");
}
