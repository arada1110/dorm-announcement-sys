import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("rooms", (table) => {
        table.increments("id").primary();
        table.string("room_number").notNullable();
        table.integer("dormitory_id");
        table.integer("building_id");
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("rooms");
}
