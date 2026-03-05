import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("dormitory").delete();
    await knex("dormitory").insert([
        {
            id: 1,
            dormitory_name: "หอพักหญิงลิ้มฮกไถ่",
            address: "เลขที่ 23 ถ.สนามจันทร์ ต.สนามจันทร์ อ.เมืองนครปฐม จ.นครปฐม 73000",
        },
    ]);
}
