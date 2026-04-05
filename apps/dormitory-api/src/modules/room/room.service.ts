import { Injectable } from "@nestjs/common";
import { IRoom } from "@/data/abstactions/entities/IRoom";
import { RoomRepository } from "@/data/sql/repositories/Room.repository";
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

    async listRoom(floor?: number) {
        const rooms = await this.roomRepo.listRoom();

        if (typeof floor !== "number" || Number.isNaN(floor)) {
            return rooms;
        }

        return rooms.filter((room) => room.floor === floor);
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
            floor: entities.floor,
        };

        return await this.roomRepo.createRoom(room);
    }

    async deleteRoom(id: number) {
        await this.roomRepo.deleteRoom(id);
    }

    async findRoomByBuilding(buildingName: string, floor?: number) {
        return await this.roomRepo.findByBuilding(buildingName, floor);
    }

    async findRoomById(roomId: number) {
        return this.roomRepo.findRoomById(roomId);
    }
}
