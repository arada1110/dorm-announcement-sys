import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { AnnouncementController } from "./announcement/announcement.controller";
import { AnnouncementService } from "./announcement/announcement.service";
import { AnnouncementRepository } from "src/data/sql/repositories/Announcement.repository";
import { AnnouncementCategoryRepository } from "src/data/sql/repositories/AnnouncementCategery.repository";

@Module({
    imports: [],
    controllers: [AnnouncementController],
    providers: [AnnouncementService, AnnouncementRepository, AnnouncementCategoryRepository],
    exports: [AnnouncementService],
})
export class AnnouncementModule {}
