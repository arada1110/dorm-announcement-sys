import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("buildings").delete();
    await knex("buildings").insert([
        {
            id: 1,
            building_name: "อาคาร 1",
            dormitory_id: 1,
        },
    ]);
}
