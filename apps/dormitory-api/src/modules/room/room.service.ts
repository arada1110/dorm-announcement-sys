import { Injectable } from "@nestjs/common";
import { IRoom } from "src/data/abstactions/entities/IRoom";
import { RoomRepository } from "src/data/sql/repositories/Room.repository";
import { CreateRoom } from "./dto/room.dto";
import { DormitoryService } from "../dormitory/dormitory.service";
import { BuildingService } from "../building/building.service";

@Injectable()
export class RoomService {
    constructor(
        private readonly roomRepo: RoomRepository,
        private dormServ: DormitoryService,
        private buildServ: BuildingService,
    ) {}

    async listRoom() {
        return this.roomRepo.listRoom();
    }

    async findRoom(roomNumber: string) {
        return this.roomRepo.findRoom(roomNumber);
    }

    async createRoom(entities: CreateRoom) {
        const dorm = await this.dormServ.findDormitory(entities.dormitoryName);
        const building = await this.buildServ.findBuilding(entities.buildingName);
        const room: Partial<IRoom> = {
            room_number: entities.roomNumber,
            dormitory_id: dorm.id,
            building_id: building.id,
        };

        return await this.roomRepo.createRoom(room);
    }

    async deleteRoom(id: number) {
        await this.roomRepo.deleteRoom(id);
    }
}
