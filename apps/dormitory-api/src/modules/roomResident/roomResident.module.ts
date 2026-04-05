import { Module } from "@nestjs/common";
import { RoomResidentService } from "./roomResident.service";
import { RoomResidentRepository } from "@/data/sql/repositories/RoomResident.repository";

@Module({
    providers: [RoomResidentService, RoomResidentRepository],
    exports: [RoomResidentService],
})
export class RoomResidentModule {}
