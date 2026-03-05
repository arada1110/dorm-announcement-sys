import { IAnnouncementTarget } from "src/data/abstactions/entities/IAnnouncement";
import { IAnnouncementTargetRepository } from "src/data/abstactions/repositories/IAnnouncementTarget.repository";
import { db } from "src/database/Connection";

export class AnnouncementTargetRepository implements IAnnouncementTargetRepository {
    protected tableName: string = "announcement_targets";

    async createTargets(announcementId: number, targets: Partial<IAnnouncementTarget>): Promise<void> {
        await db(this.tableName).insert({ announcementId, targets });
    }

    async findTargetsByAnnouncementId(announcementId: number): Promise<IAnnouncementTarget[]> {
        return await db(this.tableName).where({ announcement_id: announcementId });
    }

    async deleteByAnnouncementId(announcementId: number): Promise<void> {
        await db(this.tableName).where({ announcement_id: announcementId }).delete();
    }
}
