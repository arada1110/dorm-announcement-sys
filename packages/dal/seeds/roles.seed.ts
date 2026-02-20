import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("roles").delete();
    await knex("roles").insert([
        { id: 1, role_name: "RESIDENT" },
        { id: 2, role_name: "ADMIN" },
    ]);
}
