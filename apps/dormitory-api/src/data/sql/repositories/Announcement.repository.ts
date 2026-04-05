import { IAnnouncements, PublicAnnouncement } from "@/data/abstactions/entities/IAnnouncement";
import { IAnnouncementRepository } from "@/data/abstactions/repositories/IAnnouncement.repository";
import { DatabaseRepository } from "../Database.repository";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AnnouncementRepository extends DatabaseRepository implements IAnnouncementRepository {
    protected tableName: string = "announcements";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async list(): Promise<IAnnouncements[]> {
        return this.query()("announcements as a")
            .leftJoin("announcement_targets as t", "a.id", "t.announcement_id")
            .join("announcement_categories as c", "a.category_id", "c.id")
            .select(
                "a.*",
                "c.category_name",
                this.query().raw(`
                    CASE
                        WHEN MAX(t.target_type = 'USER') THEN 'USER'
                        WHEN MAX(t.target_type = 'ROOM') THEN 'ROOM'
                        ELSE 'ALL'
                    END as target_type
                `),
                this.query().raw(`
                    CASE
                        WHEN MAX(t.target_type = 'USER') THEN 'เฉพาะผู้ใช้'
                        WHEN MAX(t.target_type = 'ROOM') THEN 'เฉพาะห้อง'
                        ELSE 'ทุกคนในหอ'
                    END as target_label
                `),
            )
            .groupBy("a.id", "c.category_name")
            .orderBy("a.created_at", "desc");
    }

    async findById(id: number): Promise<IAnnouncements> {
        return this.query()(this.tableName).where({ id }).first();
    }

    async findAnnouncementById(public_id: string): Promise<IAnnouncements> {
        return this.query()("announcements as a")
            .leftJoin("announcement_targets as t", "a.id", "t.announcement_id")
            .join("announcement_categories as c", "a.category_id", "c.id")
            .where("a.public_id", public_id)
            .select(
                "a.*",
                "c.category_name",
                this.query().raw(`
                    CASE
                        WHEN MAX(t.target_type = 'USER') THEN 'USER'
                        WHEN MAX(t.target_type = 'ROOM') THEN 'ROOM'
                        ELSE 'ALL'
                    END as target_type
                `),
                this.query().raw("MAX(t.room_id) as room_id"),
                this.query().raw("MAX(t.user_id) as user_id"),
            )
            .groupBy("a.id", "c.category_name")
            .first();
    }

    async createAnnouncement(entities: Partial<IAnnouncements>): Promise<IAnnouncements> {
        const [id] = await this.query()(this.tableName).insert(entities);
        return this.query()(this.tableName).where({ id }).first();
    }

    async updateAnnouncement(public_id: string, entities: Partial<IAnnouncements>): Promise<IAnnouncements> {
        await this.query()(this.tableName).where({ public_id }).update(entities);
        return this.query()(this.tableName).where({ public_id }).first();
    }

    async deleteAnnouncement(public_id: string): Promise<void> {
        await this.query()(this.tableName).where({ public_id }).delete();
    }

    async findAnnouncementByDormitory(
        dormitoryId: number,
        options?: { category_id?: number; limit?: number; offset?: number },
    ): Promise<IAnnouncements[]> {
        const query = this.query()(this.tableName).where({ dormitory_id: dormitoryId });

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

    async findForResident(userId: string, roomId?: number) {
        const query = this.query()("announcements as a")
            .join("announcement_targets as t", "a.id", "t.announcement_id")
            .join("announcement_categories as c", "a.category_id", "c.id")
            .where("a.is_published", true)
            .andWhere((qb) => {
                qb.where("t.target_type", "ALL").orWhere((sub) =>
                    sub.where("t.target_type", "USER").andWhere("t.user_id", userId),
                );

                if (roomId) {
                    qb.orWhere((sub) => sub.where("t.target_type", "ROOM").andWhere("t.room_id", roomId));
                }
            })
            .select(
                "a.public_id",
                "a.title",
                "a.content",
                "c.category_name",
                this.query().raw(`
                    CASE
                        WHEN MAX(t.target_type = 'USER') THEN 'USER'
                        WHEN MAX(t.target_type = 'ROOM') THEN 'ROOM'
                        ELSE 'ALL'
                    END as target_type
                `),
                "a.created_at",
            )
            .groupBy("a.public_id", "a.title", "a.content", "c.category_name", "a.created_at")
            .orderBy("a.created_at", "desc");

        return query;
    }

    async findPublicAnnouncements(): Promise<PublicAnnouncement[]> {
        return this.query()("announcements as a")
            .join("announcement_targets as t", "a.id", "t.announcement_id")
            .join("announcement_categories as c", "a.category_id", "c.id")
            .where("t.target_type", "ALL")
            .andWhere("a.is_published", true)
            .select("a.public_id", "a.title", "a.content", "c.category_name", "a.created_at")
            .orderBy("a.created_at", "desc");
    }

    async publish(publicId: string): Promise<IAnnouncements> {
        await this.query()(this.tableName).where({ public_id: publicId }).update({ is_published: true });
        return this.findAnnouncementById(publicId);
    }

    async unPublish(publicId: string): Promise<IAnnouncements> {
        await this.query()(this.tableName).where({ public_id: publicId }).update({ is_published: false });
        return this.findAnnouncementById(publicId);
    }

    async countByDormitory(dormitoryId: number) {
        const result = await this.query()(this.tableName)
            .where({ dormitory_id: dormitoryId })
            .count("id as total")
            .first();

        return result?.total || 0;
    }

    async countPublished(dormitoryId: number) {
        const result = await this.query()(this.tableName)
            .where({
                dormitory_id: dormitoryId,
                is_published: true,
            })
            .count("id as total")
            .first();

        return result?.total || 0;
    }

    async latestByDormitory(dormitoryId: number) {
        return this.query()("announcements as a")
            .leftJoin("announcement_targets as t", "a.id", "t.announcement_id")
            .join("announcement_categories as c", "a.category_id", "c.id")
            .where({ "a.dormitory_id": dormitoryId })
            .select(
                "a.*",
                "c.category_name",
                this.query().raw(`
                    CASE
                        WHEN MAX(t.target_type = 'USER') THEN 'USER'
                        WHEN MAX(t.target_type = 'ROOM') THEN 'ROOM'
                        ELSE 'ALL'
                    END as target_type
                `),
                this.query().raw(`
                    CASE
                        WHEN MAX(t.target_type = 'USER') THEN 'เฉพาะผู้ใช้'
                        WHEN MAX(t.target_type = 'ROOM') THEN 'เฉพาะห้อง'
                        ELSE 'ทุกคนในหอ'
                    END as target_label
                `),
            )
            .groupBy("a.id", "c.category_name")
            .orderBy("a.created_at", "desc")
            .limit(5);
    }
}
