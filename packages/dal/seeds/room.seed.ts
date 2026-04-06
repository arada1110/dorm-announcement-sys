import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("rooms").delete();
    await knex("rooms").insert([
        { id: 1, room_number: "201", dormitory_id: 1, building_id: 1, floor: 2 },
        { id: 2, room_number: "202", dormitory_id: 1, building_id: 1, floor: 2 },
        { id: 3, room_number: "203", dormitory_id: 1, building_id: 1, floor: 2 },
        { id: 4, room_number: "204", dormitory_id: 1, building_id: 1, floor: 2 },
        { id: 5, room_number: "205", dormitory_id: 1, building_id: 1, floor: 2 },
        { id: 6, room_number: "206", dormitory_id: 1, building_id: 1, floor: 2 },
        { id: 7, room_number: "301", dormitory_id: 1, building_id: 1, floor: 3 },
        { id: 8, room_number: "302", dormitory_id: 1, building_id: 1, floor: 3 },
        { id: 9, room_number: "303", dormitory_id: 1, building_id: 1, floor: 3 },
        { id: 10, room_number: "304", dormitory_id: 1, building_id: 1, floor: 3 },
        { id: 11, room_number: "305", dormitory_id: 1, building_id: 1, floor: 3 },
        { id: 12, room_number: "306", dormitory_id: 1, building_id: 1, floor: 3 },
        { id: 13, room_number: "401", dormitory_id: 1, building_id: 1, floor: 4 },
        { id: 14, room_number: "402", dormitory_id: 1, building_id: 1, floor: 4 },
        { id: 15, room_number: "403", dormitory_id: 1, building_id: 1, floor: 4 },
        { id: 16, room_number: "404", dormitory_id: 1, building_id: 1, floor: 4 },
        { id: 17, room_number: "405", dormitory_id: 1, building_id: 1, floor: 4 },
        { id: 18, room_number: "406", dormitory_id: 1, building_id: 1, floor: 4 },
        { id: 19, room_number: "501", dormitory_id: 1, building_id: 1, floor: 5 },
        { id: 20, room_number: "502", dormitory_id: 1, building_id: 1, floor: 5 },
        { id: 21, room_number: "503", dormitory_id: 1, building_id: 1, floor: 5 },
        { id: 22, room_number: "504", dormitory_id: 1, building_id: 1, floor: 5 },
        { id: 23, room_number: "505", dormitory_id: 1, building_id: 1, floor: 5 },
        { id: 24, room_number: "506", dormitory_id: 1, building_id: 1, floor: 5 },
    ]);
}
