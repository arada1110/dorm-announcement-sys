import { IAnnouncements } from "../entities/IAnnouncement";

export interface IAnnouncementRepository {
    list(): Promise<IAnnouncements[]>;
    findAnnouncementById(public_id: string): Promise<IAnnouncements>;
    createAnnouncement(entities: Partial<IAnnouncements>): Promise<IAnnouncements>;
    updateAnnouncement(public_id: string, entities: Partial<IAnnouncements>): Promise<IAnnouncements>;
    deleteAnnouncement(public_id: string): Promise<void>;
    findAnnouncementByDormitory(
        id: number,
        options?: {
            category_id?: number;
            limit?: number;
            offset?: number;
        },
    ): Promise<IAnnouncements[]>;
}
