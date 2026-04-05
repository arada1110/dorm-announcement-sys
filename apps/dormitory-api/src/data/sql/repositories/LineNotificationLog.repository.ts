import { ILineNotificationLogRepository } from "@/data/abstactions/repositories/ILineNotificationLog.repository";
import { DatabaseRepository } from "../Database.repository";
import { ILineNotificationLog } from "@/data/abstactions/entities/ILineNotificationLog";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LineNotificationLogRepository extends DatabaseRepository implements ILineNotificationLogRepository {
    protected tableName: string = "line_notification_logs";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async createLog(data: Partial<ILineNotificationLog>): Promise<ILineNotificationLog> {
        const [id] = await this.query()(this.tableName).insert({
            ...data,
            sent_at: new Date(),
        });

        return this.query()(this.tableName).where({ id }).first();
    }

    async findLatest(limit: number): Promise<ILineNotificationLog[]> {
        return this.query()(this.tableName).orderBy("sent_at", "desc").limit(limit);
    }

    async findByAnnouncement(announcementId: number) {
        return this.query()(this.tableName).where({ announcement_id: announcementId }).orderBy("sent_at", "desc");
    }
}
