import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    const admin = await knex("users")
        .where({ email: "admin@mail.com" })
        .first();

    if (!admin) {
        return;
    }

    await knex("admin_dormitories")
        .where({ user_id: admin.id })
        .delete();

    await knex("admin_dormitories").insert({
        user_id: admin.id,
        dormitory_id: 1,
    });
}
