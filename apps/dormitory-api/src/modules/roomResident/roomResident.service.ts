import { Injectable } from "@nestjs/common";
import { RoomResidentRepository } from "@/data/sql/repositories/RoomResident.repository";

@Injectable()
export class RoomResidentService {
    constructor(private readonly roomResidentRepo: RoomResidentRepository) {}

    async list() {
        return this.roomResidentRepo.list();
    }

    async addResident(roomId: number, userId: string) {
        return this.roomResidentRepo.createRoomResident({
            room_id: roomId,
            user_id: userId,
            start_date: new Date(),
        });
    }

    async findByUser(userId: string) {
        return this.roomResidentRepo.findByUser(userId);
    }
}
