import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("invitation_codes", (table) => {
        table.increments("id").primary();
        table.uuid("public_id").notNullable().unique();
        table.string("code").notNullable().unique();
        table.integer("dormitory_id");
        table.integer("room_id").notNullable();
        table.boolean("is_used").defaultTo(false);
        table.timestamp("expired_at");
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("invitation_codes");
}
