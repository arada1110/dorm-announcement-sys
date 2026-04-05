import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("line_linking_tokens", (table) => {
        table.increments("id").primary();
        table.uuid("user_id").notNullable();
        table.string("token", 6).notNullable().unique();
        table.timestamp("expires_at").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("line_linking_tokens");
}
