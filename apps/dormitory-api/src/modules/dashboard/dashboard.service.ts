import { Injectable } from "@nestjs/common";
import { AnnouncementRepository } from "@/data/sql/repositories/Announcement.repository";
import { InviteCodeRepository } from "@/data/sql/repositories/Invite.repository";
import { RoomResidentRepository } from "@/data/sql/repositories/RoomResident.repository";

@Injectable()
export class DashboardService {
    constructor(
        private readonly announcementRepo: AnnouncementRepository,
        private readonly inviteRepo: InviteCodeRepository,
        private readonly roomResidentRepo: RoomResidentRepository,
    ) {}

    async getStats(user: any) {
        const dormitoryId = user.dormitoryId;

        const totalAnnouncements = await this.announcementRepo.countByDormitory(dormitoryId);

        const publishedAnnouncements = await this.announcementRepo.countPublished(dormitoryId);

        const totalResidents = await this.roomResidentRepo.countResidents(dormitoryId);
        const invites = await this.inviteRepo.list();
        const dormitoryInvites = invites.filter((invite) => invite.dormitory_id === dormitoryId);
        const usedInvites = dormitoryInvites.filter((invite) => invite.is_used).length;

        const latestAnnouncements = await this.announcementRepo.latestByDormitory(dormitoryId);

        return {
            totalAnnouncements,
            publishedAnnouncements,
            totalResidents,
            inviteUsage: `${usedInvites}/${dormitoryInvites.length}`,
            latestAnnouncements,
        };
    }
}
