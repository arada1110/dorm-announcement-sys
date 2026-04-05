import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { AnnouncementRepository } from "@/data/sql/repositories/Announcement.repository";
import { RoomResidentRepository } from "@/data/sql/repositories/RoomResident.repository";

@Module({
    controllers: [DashboardController],
    providers: [DashboardService, AnnouncementRepository, RoomResidentRepository],
})
export class DashboardModule {}
