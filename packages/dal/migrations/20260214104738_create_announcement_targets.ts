import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("announcement_targets", (table) => {
        table.increments("id").primary();
        table.integer("announcement_id");
        table.enum("target_type", ["ALL", "ROOM", "USER"]).notNullable();
        table.integer("room_id").nullable();
        table.uuid("user_id").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("announcement_targets");
}
