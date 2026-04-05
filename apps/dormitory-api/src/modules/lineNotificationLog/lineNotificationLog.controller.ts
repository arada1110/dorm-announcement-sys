import { Controller, Get, Param } from "@nestjs/common";
import { LineNotificationLogService } from "./lineNotificationLog.service";

@Controller("line-notification-logs")
export class LineNotificationLogController {
    constructor(private readonly service: LineNotificationLogService) {}

    // ดึง logs ล่าสุด
    @Get()
    getLogs() {
        return this.service.getLatestLogs();
    }

    // ดึง logs ตาม announcement
    @Get(":announcementId")
    getLogsByAnnouncement(@Param("announcementId") announcementId: number) {
        return this.service.getLogsByAnnouncement(announcementId);
    }
}
