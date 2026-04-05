import { Injectable } from "@nestjs/common";
import { LineNotificationLogRepository } from "@/data/sql/repositories/LineNotificationLog.repository";

@Injectable()
export class LineNotificationLogService {
    constructor(private readonly repo: LineNotificationLogRepository) {}

    async getLatestLogs() {
        const limit = 20;
        return this.repo.findLatest(limit);
    }

    async getLogsByAnnouncement(announcementId: number) {
        return this.repo.findByAnnouncement(announcementId);
    }
}
