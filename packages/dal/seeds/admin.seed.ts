import type { Knex } from "knex";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
    const existingAdmin = await knex("users").where({ email: "admin@mail.com" }).first();

    if (existingAdmin) {
        return;
    }

    const password_hash = await bcrypt.hash("admin123", 10);

    await knex("users").insert({
        id: uuidv4(),
        username: "admin",
        first_name: "System",
        last_name: "Admin",
        email: "admin@mail.com",
        password_hash,
        role_id: 2,
        status: "ACTIVE",
        created_at: new Date(),
    });
}
