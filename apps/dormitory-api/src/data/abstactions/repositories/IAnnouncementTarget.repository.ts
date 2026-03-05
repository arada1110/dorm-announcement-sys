import { IAnnouncementTarget } from "../entities/IAnnouncement";

export interface IAnnouncementTargetRepository {
    createTargets(announcementId: number, targets: Partial<IAnnouncementTarget>): Promise<void>;
    findTargetsByAnnouncementId(announcementId: number): Promise<IAnnouncementTarget[]>;
    deleteByAnnouncementId(announcementId: number): Promise<void>;
}
