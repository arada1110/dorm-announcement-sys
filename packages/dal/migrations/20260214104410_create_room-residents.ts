import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("room_residents", (table) => {
        table.increments("id").primary();
        table.integer("room_id");
        table.uuid("user_id").notNullable();
        table.date("start_date").notNullable();
        table.date("end_date").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("room_residents");
}
