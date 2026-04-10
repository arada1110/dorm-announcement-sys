import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("announcement_categories")
        .insert([
            {
                category_name: "GENERAL",
                description: "ข่าวที่ส่งถึงผู้พักทั้งหมด",
                is_active: true,
            },
            {
                category_name: "ANNOUNCEMENT",
                description: "ประกาศสำคัญ",
                is_active: true,
            },
            {
                category_name: "EVENT",
                description: "กิจกรรม",
                is_active: true,
            },
            {
                category_name: "PAYMENT",
                description: "การชำระเงิน",
                is_active: true,
            },
            {
                category_name: "MAINTENANCE",
                description: "การซ่อมบำรุง",
                is_active: true,
            },
        ])
        .onConflict("category_name")
        .merge();
}
