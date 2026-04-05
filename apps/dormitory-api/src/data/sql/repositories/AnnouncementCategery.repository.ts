import { IAnnouncementCategories } from "@/data/abstactions/entities/IAnnouncement";
import { IAnnouncementCategoryRepository } from "@/data/abstactions/repositories/IAnnouncementCategory.repository";
import { DatabaseRepository } from "../Database.repository";
import { Injectable } from "@nestjs/common";
import { AppUnitOfWork } from "../AppUnitOfWork";

@Injectable()
export class AnnouncementCategoryRepository extends DatabaseRepository implements IAnnouncementCategoryRepository {
    protected tableName: string = "announcement_categories";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async list(): Promise<IAnnouncementCategories[]> {
        return await this.query()(this.tableName).select("*");
    }

    async createCategory(cat_name: string): Promise<IAnnouncementCategories> {
        const [id] = await this.query()(this.tableName).insert(cat_name);
        return this.query()(this.tableName).where({ id: id }).first();
    }

    async deleteCategory(id: number): Promise<void> {
        await this.query()(this.tableName).where({ id: id }).delete();
    }

    async findeAnnouncementByName(name: string): Promise<IAnnouncementCategories> {
        return await this.query()(this.tableName).where({ category_name: name }).first();
    }
}
