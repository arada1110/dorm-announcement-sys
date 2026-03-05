import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AnnouncementRepository } from "src/data/sql/repositories/Announcement.repository";
import { CreateAnnouncementDto, UpdateAnnouncementDto } from "../dto/Announcement.dto";
import { AnnouncementCategoryRepository } from "src/data/sql/repositories/AnnouncementCategery.repository";
import { error } from "console";

@Injectable()
export class AnnouncementService {
    constructor(
        private readonly announcementRepo: AnnouncementRepository,
        private readonly categoryRepo: AnnouncementCategoryRepository,
    ) {}

    async create(dto: CreateAnnouncementDto, user: any) {
        const category = await this.categoryRepo.findeAnnouncementByName(dto.categoryName);
        if (!category) {
            throw new BadRequestException("Invalid category");
        }
        const created = await this.announcementRepo.createAnnouncement({
            public_id: crypto.randomUUID(),
            title: dto.title,
            content: dto.content,
            category_id: category.id,
            dormitory_id: user.dormitoryId,
            created_by: user.id,
            is_line_notification_enabled: true,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return created;
    }

    async list(user: any, query?: { categoryId?: number; limit?: number; offset?: number }) {
        return this.announcementRepo.findAnnouncementByDormitory(user.dormitoryId, {
            category_id: query?.categoryId,
            limit: query?.limit,
            offset: query?.offset,
        });
    }

    async listAll() {
        return this.announcementRepo.list();
    }

    async findOne(publicId: string) {
        const announcement = await this.announcementRepo.findAnnouncementById(publicId);
        if (!announcement) {
            throw new NotFoundException("Announcement not found");
        }

        return announcement;
    }

    async update(publicId: string, dto: UpdateAnnouncementDto) {
        const existing = await this.announcementRepo.findAnnouncementById(publicId);
        if (!existing) throw new NotFoundException("Announcement not found");

        const announcement = await this.announcementRepo.updateAnnouncement(existing.public_id, {
            ...dto,
            updated_at: new Date(),
        });
        return announcement;
    }

    async delete(publicId: string) {
        const existing = await this.announcementRepo.findAnnouncementById(publicId);
        if (!existing) throw new NotFoundException("Announcement not found");

        try {
            await this.announcementRepo.deleteAnnouncement(existing.public_id);
            throw "deleted";
        } catch (error) {
            throw new error();
        }
    }
}
