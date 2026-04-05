import { Module } from "@nestjs/common";
import { AnnouncementTargetController } from "./announcementTarget.controller";
import { AnnouncementTargetService } from "./announcementTarget.service";
import { AnnouncementTargetRepository } from "@/data/sql/repositories/AnnouncementTarget.repository";

@Module({
    controllers: [AnnouncementTargetController],
    providers: [AnnouncementTargetService, AnnouncementTargetRepository],
    exports: [AnnouncementTargetService],
})
export class AnnouncementTargetModule {}
