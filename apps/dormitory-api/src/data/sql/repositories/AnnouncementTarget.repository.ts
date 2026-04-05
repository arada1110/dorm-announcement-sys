import { IAnnouncementTarget } from "@/data/abstactions/entities/IAnnouncement";
import { IAnnouncementTargetRepository } from "@/data/abstactions/repositories/IAnnouncementTarget.repository";
import { DatabaseRepository } from "../Database.repository";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AnnouncementTargetRepository extends DatabaseRepository implements IAnnouncementTargetRepository {
    protected tableName: string = "announcement_targets";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async createTargets(entities: Partial<IAnnouncementTarget>): Promise<IAnnouncementTarget> {
        const [id] = await this.query()(this.tableName).insert(entities);
        return this.query()(this.tableName).where({ id }).first();
    }

    async findTargetsByAnnouncementId(announcementId: number): Promise<IAnnouncementTarget[]> {
        return await this.query()(this.tableName).where({ announcement_id: announcementId });
    }

    async deleteByAnnouncementId(announcementId: number): Promise<void> {
        await this.query()(this.tableName).where({ announcement_id: announcementId }).delete();
    }
}
