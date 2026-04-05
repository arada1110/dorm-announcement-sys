import { IRoomResident } from "@/data/abstactions/entities/IRoom";
import { IRoomResidentRepository } from "@/data/abstactions/repositories/IRoomResident.repository";
import { DatabaseRepository } from "../Database.repository";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoomResidentRepository extends DatabaseRepository implements IRoomResidentRepository {
    protected tableName: string = "room_residents";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async list(): Promise<IRoomResident[]> {
        return await this.query()(this.tableName).select("*");
    }

    async createRoomResident(entities: Partial<IRoomResident>): Promise<IRoomResident> {
        const [id] = await this.query()(this.tableName).insert(entities);
        return this.query()(this.tableName).where({ id: id }).first();
    }

    async findByUser(userId: string): Promise<IRoomResident> {
        return await this.query()(this.tableName).where({ user_id: userId }).first();
    }

    async countResidents(dormitoryId: number) {
        const result = await this.query()("room_residents as rr")
            .join("rooms as r", "rr.room_id", "r.id")
            .join("users as u", "rr.user_id", "u.id")
            .join("roles as ro", "u.role_id", "ro.id")
            .where("r.dormitory_id", dormitoryId)
            .andWhere("ro.role_name", "RESIDENT")
            .andWhere("u.status", "ACTIVE")
            .countDistinct("rr.user_id as total")
            .first();

        return result?.total || 0;
    }

    async findUsersByRoom(roomId: number) {
        return this.query()(this.tableName).where({ room_id: roomId }).select("user_id");
    }

    async findUsersByDormitory(dormitoryId: number) {
        return this.query()("room_residents as rr")
            .join("rooms as r", "rr.room_id", "r.id")
            .where("r.dormitory_id", dormitoryId)
            .select("rr.user_id");
    }
}
