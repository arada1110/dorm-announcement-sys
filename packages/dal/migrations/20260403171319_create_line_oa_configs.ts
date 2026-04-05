import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("line_oa_configs", (tb) => {
        tb.string("id").primary();
        tb.integer("dormitory_id").notNullable();
        tb.string("line_oa_id").notNullable();
        tb.string("channel_id").notNullable();
        tb.string("channel_secret").notNullable();
        tb.text("channel_access_token").notNullable();
        tb.text("add_friend_url").nullable();
        tb.string("liff_id").nullable();
        tb.boolean("notification_enabled").defaultTo(true);
        tb.boolean("is_active").defaultTo(true);
        tb.timestamp("created_at").defaultTo(knex.fn.now());
        tb.timestamp("updated_at");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("line_oa_configs");
}
