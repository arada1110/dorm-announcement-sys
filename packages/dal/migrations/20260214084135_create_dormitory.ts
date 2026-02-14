import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("dormitory", (table) => {
        table.increments("id").primary();
        table.string("dormitory_name").notNullable();
        table.text("address");
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("dormitory");
}
