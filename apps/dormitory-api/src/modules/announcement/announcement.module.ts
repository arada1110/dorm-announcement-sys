import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { AnnouncementController } from "./announcement/announcement.controller";
import { AnnouncementService } from "./announcement/announcement.service";
import { AnnouncementRepository } from "@/data/sql/repositories/Announcement.repository";
import { AnnouncementCategoryRepository } from "@/data/sql/repositories/AnnouncementCategery.repository";
import { AdminModule } from "../admin/admin.module";
import { AdminService } from "../admin/admin.service";
import { AppUnitOfWork } from "@/data/sql/AppUnitOfWork";
import { AnnouncementTargetModule } from "./announcementTarget/announcementTarget.module";
import { DatabaseModule } from "@/database/database.module";
import { LineNotificationService } from "@/modules/lineAccount/lineNotification.service";
import { LineAccountModule } from "../lineAccount/lineAccount.module";

@Module({
    imports: [DatabaseModule, AdminModule, AnnouncementTargetModule, LineAccountModule],
    controllers: [AnnouncementController],
    providers: [AnnouncementService, AdminService, AppUnitOfWork],
    exports: [AnnouncementService],
})
export class AnnouncementModule {}
