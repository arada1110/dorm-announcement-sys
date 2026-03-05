import { IRoom } from "src/data/abstactions/entities/IRoom";
import { IRoomRepository } from "src/data/abstactions/repositories/IRoom.repository";
import { db } from "src/database/Connection";

export class RoomRepository implements IRoomRepository {
    protected tableName: string = "rooms";

    async listRoom(): Promise<IRoom[]> {
        return db(this.tableName).select("*");
    }

    async findRoom(roomNumber: string): Promise<IRoom> {
        return db(this.tableName).where({ room_number: roomNumber }).first();
    }

    async createRoom(entities: Partial<IRoom>): Promise<IRoom> {
        const [id] = await db(this.tableName).insert(entities);
        return db(this.tableName).where({ id: id }).first();
    }
    async deleteRoom(id: number): Promise<void> {
        await db(this.tableName).where({ id: id }).delete();
    }
}
