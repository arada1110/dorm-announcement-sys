import { IAnnouncements } from "src/data/abstactions/entities/IAnnouncement";
import { IAnnouncementRepository } from "src/data/abstactions/repositories/IAnnouncement.repository";
import { db } from "src/database/Connection";

export class AnnouncementRepository implements IAnnouncementRepository {
    protected tableName: string = "announcements";

    async list(): Promise<IAnnouncements[]> {
        return await db(this.tableName).select("*");
    }

    async findAnnouncementById(public_id: string): Promise<IAnnouncements> {
        return await db(this.tableName).where({ public_id: public_id }).first();
    }

    async createAnnouncement(entities: Partial<IAnnouncements>): Promise<IAnnouncements> {
        const [id] = await db(this.tableName).insert(entities);
        return db(this.tableName).where({ id: id }).first();
    }

    async updateAnnouncement(public_id: string, entities: Partial<IAnnouncements>): Promise<IAnnouncements> {
        await db(this.tableName).where({ public_id: public_id }).update(entities);
        return db(this.tableName).where({ public_id: public_id }).first();
    }

    async deleteAnnouncement(public_id: string): Promise<void> {
        await db(this.tableName).where({ public_id: public_id }).delete();
    }

    async findAnnouncementByDormitory(
        dormitoryId: number,
        options?: { category_id?: number; limit?: number; offset?: number },
    ): Promise<IAnnouncements[]> {
        const query = db(this.tableName).where({ dormitory_id: dormitoryId });

        if (options?.category_id) {
            query.andWhere({ category_id: options.category_id });
        }

        if (options?.limit) {
            query.limit(options.limit);
        }

        if (options?.offset) {
            query.offset(options.offset);
        }

        return await query.orderBy("created_at", "desc");
    }
}
