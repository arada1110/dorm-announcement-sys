import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { AnnouncementRepository } from "@/data/sql/repositories/Announcement.repository";
import { CreateAnnouncementDto, UpdateAnnouncementDto } from "../dto/Announcement.dto";
import { AnnouncementCategoryRepository } from "@/data/sql/repositories/AnnouncementCategery.repository";
import { AppUnitOfWork } from "@/data/sql/AppUnitOfWork";
import { AnnouncementTargetService } from "../announcementTarget/announcementTarget.service";
import { AdminService } from "@/modules/admin/admin.service";
import { AnnouncementTargetDto } from "../announcementTarget/dto/announcementTarget.dto";
import { LineNotificationService } from "@/modules/lineAccount/lineNotification.service";
import { RoomResidentRepository } from "@/data/sql/repositories/RoomResident.repository";

@Injectable()
export class AnnouncementService {
    constructor(
        private readonly announcementRepo: AnnouncementRepository,
        private readonly categoryRepo: AnnouncementCategoryRepository,
        private readonly announcementTargetService: AnnouncementTargetService,
        private readonly adminService: AdminService,
        private readonly uow: AppUnitOfWork,
        private readonly lineNotificationService: LineNotificationService,
        private readonly roomResidentRepo: RoomResidentRepository,
    ) {}

    async create(dto: CreateAnnouncementDto) {
        return this.uow.execute(async () => {
            try {
                const adminDorm = await this.adminService.findByUserAdmin(dto.creatorId || "");
                if (!adminDorm) {
                    throw new Error();
                }

                const category = await this.categoryRepo.findeAnnouncementByName(dto.categoryName);

                if (!category) {
                    throw new BadRequestException("Invalid category");
                }

                const announcement = await this.announcementRepo.createAnnouncement({
                    public_id: crypto.randomUUID(),
                    title: dto.title,
                    content: dto.content,
                    category_id: category.id,
                    dormitory_id: adminDorm.dormitory_id,
                    created_by: adminDorm.user_id,
                    is_line_notification_enabled: dto.isLineNotificationEnabled ?? false,
                    created_at: new Date(),
                    updated_at: new Date(),
                });

                const announceTarget: AnnouncementTargetDto = {
                    announcement_id: announcement.id,
                    tartget_type: dto.targetType,
                    room_id: dto.roomId,
                    target_user_id: dto.targetUserId,
                };

                await this.announcementTargetService.create(announceTarget);

                if (dto.isLineNotificationEnabled) {
                    await this.triggerLineNotification(
                        announcement.id,
                        dto.targetType,
                        dto.title,
                        adminDorm.dormitory_id,
                        dto.targetUserId,
                        dto.roomId,
                    );
                    await this.announcementRepo.updateAnnouncement(announcement.public_id, {
                        is_line_sent: true,
                        line_sent_at: new Date(),
                    });
                }

                return announcement;
            } catch (error) {
                throw error;
            }
        });
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

    async findOneWithAuth(publicId: string, userId: string | null, roomId: number | null) {
        const announcement = await this.announcementRepo.findAnnouncementById(publicId);
        if (!announcement) throw new NotFoundException("Announcement not found");

        const targets = await this.announcementTargetService.getByAnnouncementId(announcement.id);
        const target = targets[0];

        if (!target || target.target_type === "ALL") return announcement;

        if (!userId) throw new ForbiddenException("Please login to view this announcement");

        if (target.target_type === "ROOM" && target.room_id === roomId) return announcement;
        if (target.target_type === "USER" && target.user_id === userId) return announcement;

        throw new ForbiddenException("You don't have permission to view this announcement");
    }

    async update(publicId: string, dto: UpdateAnnouncementDto) {
        const existing = await this.announcementRepo.findAnnouncementById(publicId);
        if (!existing) throw new NotFoundException("Announcement not found");

        return this.uow.execute(async () => {
            const updatePayload: Record<string, any> = {
                updated_at: new Date(),
            };

            if (dto.title !== undefined) updatePayload.title = dto.title;
            if (dto.content !== undefined) updatePayload.content = dto.content;
            if (dto.categoryName) {
                const category = await this.categoryRepo.findeAnnouncementByName(dto.categoryName);
                if (!category) throw new BadRequestException("Invalid category");
                updatePayload.category_id = category.id;
            }

            const shouldSendLine = dto.isLineNotificationEnabled && !existing.is_line_sent;

            if (dto.isLineNotificationEnabled !== undefined) {
                updatePayload.is_line_notification_enabled = dto.isLineNotificationEnabled;
            }

            await this.announcementRepo.updateAnnouncement(existing.public_id, updatePayload);

            if (dto.targetType) {
                await this.announcementTargetService.deleteByAnnouncementId(existing.id);
                const announceTarget: AnnouncementTargetDto = {
                    announcement_id: existing.id,
                    tartget_type: dto.targetType,
                    room_id: dto.targetType === "ROOM" ? (dto.roomId ?? null) : null,
                    target_user_id: dto.targetType === "USER" ? (dto.userId ?? null) : null,
                };
                await this.announcementTargetService.create(announceTarget);
            }

            if (shouldSendLine) {
                const targets = await this.announcementTargetService.getByAnnouncementId(existing.id);
                if (targets.length) {
                    const target = targets[0];
                    await this.triggerLineNotification(
                        existing.id,
                        target.target_type,
                        dto.title ?? existing.title,
                        existing.dormitory_id,
                        target.user_id || "",
                        target.room_id || 0,
                    );
                    await this.announcementRepo.updateAnnouncement(existing.public_id, {
                        is_line_sent: true,
                        line_sent_at: new Date(),
                    });
                }
            }

            return this.announcementRepo.findAnnouncementById(existing.public_id);
        });
    }

    async delete(publicId: string) {
        const existing = await this.announcementRepo.findAnnouncementById(publicId);
        if (!existing) throw new NotFoundException("Announcement not found");

        try {
            await this.announcementRepo.deleteAnnouncement(existing.public_id);
            return { message: "deleted" };
        } catch (error) {
            throw error;
        }
    }

    async getPublicAnnouncements() {
        return this.announcementRepo.findPublicAnnouncements();
    }

    async getResidentAnnouncements(userId: string, roomId: number) {
        return this.announcementRepo.findForResident(userId, roomId);
    }

    async publish(publicId: string) {
        await this.findOne(publicId);
        return this.announcementRepo.publish(publicId);
    }

    async unpublish(publicId: string) {
        await this.findOne(publicId);
        return this.announcementRepo.unPublish(publicId);
    }

    async sendLineNotification(publicId: string) {
        const announcement = await this.announcementRepo.findAnnouncementById(publicId);

        if (!announcement) {
            throw new NotFoundException("Announcement not found");
        }

        if (announcement.is_line_sent) {
            throw new BadRequestException("LINE notification already sent");
        }

        const targets = await this.announcementTargetService.getByAnnouncementId(announcement.id);
        if (!targets.length) {
            throw new BadRequestException("No targets found");
        }

        const target = targets[0];
        await this.triggerLineNotification(
            announcement.id,
            target.target_type,
            announcement.title,
            announcement.dormitory_id,
            target.user_id || "",
            target.room_id || 0,
        );

        await this.announcementRepo.updateAnnouncement(publicId, {
            is_line_sent: true,
            line_sent_at: new Date(),
        });
        return { message: "LINE notification sent successfully" };
    }

    async triggerLineNotification(
        announcementId: number,
        targetType: string,
        title: string,
        dormitoryId: number,
        userId?: string,
        roomId?: number,
    ) {
        const baseUrl = process.env.APP_URL;
        const announcement = await this.announcementRepo.findById(announcementId);

        let link: string;
        if (targetType === "ALL") {
            link = `${baseUrl}/announcements/${announcement.public_id}`;
        } else {
            link = `${baseUrl}/login?redirect=/resident/announcements/${announcement.public_id}`;
        }

        let targetUsers: string[] = [];

        if (targetType === "USER" && userId) {
            targetUsers = [userId];
        }

        if (targetType === "ROOM" && roomId) {
            const residents = await this.roomResidentRepo.findUsersByRoom(roomId);
            targetUsers = residents.map((r) => r.user_id);
        }

        if (targetType === "ALL") {
            const residents = await this.roomResidentRepo.findUsersByDormitory(dormitoryId);
            targetUsers = residents.map((r) => r.user_id);
        }

        for (const uid of targetUsers) {
            await this.lineNotificationService.sendToUser(announcementId, uid, title, link, dormitoryId);
        }
    }
}
