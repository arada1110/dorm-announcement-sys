import { IAnnouncementCategories } from "src/data/abstactions/entities/IAnnouncement";
import { IAnnouncementCategoryRepository } from "src/data/abstactions/repositories/IAnnouncementCategory.repository";
import { db } from "src/database/Connection";

export class AnnouncementCategoryRepository implements IAnnouncementCategoryRepository {
    protected tableName: string = "announcement_categories";

    async list(): Promise<IAnnouncementCategories[]> {
        return await db(this.tableName).select("*");
    }

    async createCategory(cat_name: string): Promise<IAnnouncementCategories> {
        const [id] = await db(this.tableName).insert(cat_name);
        return db(this.tableName).where({ id: id }).first();
    }

    async deleteCategory(id: number): Promise<void> {
        await db(this.tableName).where({ id: id }).delete();
    }

    async findeAnnouncementByName(name: string): Promise<IAnnouncementCategories> {
        return await db(this.tableName).where({ category_name: name }).first();
    }
}
