import { Injectable } from "@nestjs/common";
import { TargetTypes } from "src/data/abstactions/entities/IAnnouncement";
import { AnnouncementTargetRepository } from "src/data/sql/repositories/AnnouncementTarget.repository";

@Injectable()
export class AnnouncementTargetService {
    constructor(private readonly targetRepo: AnnouncementTargetRepository) {}

    async create(announcementId: number, targetType: TargetTypes, roomId?: number, userId?: string) {
        let targets;

        if (targetType === TargetTypes.ALL) {
            targets = TargetTypes.ALL;
        }

        if (targetType === TargetTypes.ROOM) {
            targets = roomId;
        }

        if (targetType === TargetTypes.USER) {
            targets = userId;
        }

        await this.targetRepo.createTargets(announcementId, targets);
    }

    async getByAnnouncementId(announcementId: number) {
        return this.targetRepo.findTargetsByAnnouncementId(announcementId);
    }

    async deleteByAnnouncementId(announcementId: number) {
        await this.targetRepo.deleteByAnnouncementId(announcementId);
    }
}
