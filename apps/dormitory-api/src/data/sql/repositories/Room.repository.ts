import { IRoom } from "@/data/abstactions/entities/IRoom";
import { IRoomRepository } from "@/data/abstactions/repositories/IRoom.repository";
import { DatabaseRepository } from "../Database.repository";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoomRepository extends DatabaseRepository implements IRoomRepository {
    protected tableName: string = "rooms";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async listRoom(): Promise<IRoom[]> {
        return this.query()(this.tableName)
            .leftJoin("buildings as b", "rooms.building_id", "b.id")
            .leftJoin("dormitory as d", "rooms.dormitory_id", "d.id")
            .select(
                "rooms.*",
                "b.building_name",
                "d.dormitory_name",
            )
            .orderBy([
                { column: "b.building_name", order: "asc" },
                { column: "rooms.floor", order: "asc" },
                { column: "rooms.room_number", order: "asc" },
            ]);
    }

    async findRoom(roomNumber: string): Promise<IRoom> {
        return this.query()(this.tableName).where({ room_number: roomNumber }).first();
    }

    async createRoom(entities: Partial<IRoom>): Promise<IRoom> {
        const [id] = await this.query()(this.tableName).insert(entities);
        return this.query()(this.tableName).where({ id: id }).first();
    }
    async deleteRoom(id: number): Promise<void> {
        await this.query()(this.tableName).where({ id: id }).delete();
    }

    async findByBuilding(buildingName: string, floor?: number): Promise<IRoom[]> {
        const query = this.query()(this.tableName)
            .join("buildings as b", "rooms.building_id", "b.id")
            .join("dormitory as d", "rooms.dormitory_id", "d.id")
            .where("b.building_name", buildingName)
            .select(
                "rooms.id",
                "rooms.room_number",
                "rooms.dormitory_id",
                "rooms.building_id",
                "rooms.floor",
                "d.dormitory_name",
                "b.building_name",
            )
            .orderBy([
                { column: "rooms.floor", order: "asc" },
                { column: "rooms.room_number", order: "asc" },
            ]);

        if (typeof floor === "number" && !Number.isNaN(floor)) {
            query.andWhere("rooms.floor", floor);
        }

        return await query;
    }

    async findRoomById(roomId: number): Promise<IRoom> {
        return await this.query()(this.tableName)
            .join("buildings as b", "rooms.building_id", "b.id")
            .join("dormitory as d", "rooms.dormitory_id", "d.id")
            .where({ "rooms.id": roomId })
            .select(
                "rooms.id",
                "rooms.room_number",
                "rooms.dormitory_id",
                "rooms.building_id",
                "rooms.floor",
                "d.dormitory_name",
                "b.building_name",
            )
            .first();
    }
}
