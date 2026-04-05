import { IAnnouncementTarget } from "../entities/IAnnouncement";

export interface IAnnouncementTargetRepository {
    createTargets(entities: Partial<IAnnouncementTarget>): Promise<IAnnouncementTarget>;
    findTargetsByAnnouncementId(announcementId: number): Promise<IAnnouncementTarget[]>;
    deleteByAnnouncementId(announcementId: number): Promise<void>;
}
