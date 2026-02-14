import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("buildings", (table) => {
        table.increments("id").primary();
        table.string("building_name").notNullable();
        table.integer("dormitory_id");
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("buildings");
}
