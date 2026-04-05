import { Injectable } from "@nestjs/common";
import { IAnnouncementTarget, TargetTypes } from "@/data/abstactions/entities/IAnnouncement";
import { AnnouncementTargetRepository } from "@/data/sql/repositories/AnnouncementTarget.repository";
import { AnnouncementTargetDto } from "./dto/announcementTarget.dto";
import { AppUnitOfWork } from "@/data/sql/AppUnitOfWork";

@Injectable()
export class AnnouncementTargetService {
    constructor(private readonly targetRepo: AnnouncementTargetRepository) {}

    async create(dto: AnnouncementTargetDto) {
        try {
            const targets: IAnnouncementTarget = {
                announcement_id: dto.announcement_id,
                target_type: dto.tartget_type,
                room_id: dto.room_id ?? null,
                user_id: dto.target_user_id ?? null,
            };

            if (dto.tartget_type === TargetTypes.ROOM && !dto.room_id) {
                throw new Error("room_id is required for ROOM target");
            }

            if (dto.tartget_type === TargetTypes.USER && !dto.target_user_id) {
                throw new Error("user_id is required for USER target");
            }

            await this.targetRepo.createTargets(targets);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getByAnnouncementId(announcementId: number) {
        return this.targetRepo.findTargetsByAnnouncementId(announcementId);
    }

    async deleteByAnnouncementId(announcementId: number) {
        await this.targetRepo.deleteByAnnouncementId(announcementId);
    }
}
