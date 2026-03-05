import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { RoomService } from "./room.service";
import { RoomController } from "./room.controller";
import { DormitoryService } from "../dormitory/dormitory.service";
import { BuildingService } from "../building/building.service";
import { RoomRepository } from "src/data/sql/repositories/Room.repository";
import { DormitoryModule } from "../dormitory/dormitory.module";
import { BuildingModule } from "../building/building.module";

@Module({
    imports: [UserModule, DormitoryModule, BuildingModule],
    controllers: [RoomController],
    providers: [RoomService, RoomRepository],
    exports: [RoomService],
})
export class RoomModule {}
