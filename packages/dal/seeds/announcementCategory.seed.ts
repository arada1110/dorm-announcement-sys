import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("announcement_categories").delete();
    await knex("announcement_categories").insert([
        { category_name: "GENERAL", description: "ข่าวที่ส่งถึงผู้พักทั้งหมด", is_active: true },
        { category_name: "ROOM", description: "ข่าวเฉพาะห้อง", is_active: true },
        { category_name: "BUILDING", description: "ข่าวเฉพาะอาคาร", is_active: true },
    ]);
}
