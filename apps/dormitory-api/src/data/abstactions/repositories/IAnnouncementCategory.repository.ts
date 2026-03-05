import { IAnnouncementCategories } from "../entities/IAnnouncement";

export interface IAnnouncementCategoryRepository {
    list(): Promise<IAnnouncementCategories[]>;
    createCategory(cat_name: string): Promise<IAnnouncementCategories>;
    deleteCategory(id: number): Promise<void>;
    findeAnnouncementByName(name: string): Promise<IAnnouncementCategories>;
}
