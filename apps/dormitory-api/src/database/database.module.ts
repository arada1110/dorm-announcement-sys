import { Global, Module } from "@nestjs/common";
import { AppUnitOfWork } from "@/data/sql/AppUnitOfWork";
import { AdminDormitoryRepository } from "@/data/sql/repositories/AdminDormitory.repository";
import { AnnouncementRepository } from "@/data/sql/repositories/Announcement.repository";
import { AnnouncementCategoryRepository } from "@/data/sql/repositories/AnnouncementCategery.repository";
import { AnnouncementTargetRepository } from "@/data/sql/repositories/AnnouncementTarget.repository";
import { BuildingRepository } from "@/data/sql/repositories/Building.repository";
import { DormitoryRepository } from "@/data/sql/repositories/Dormitory.repostory";
import { InviteCodeRepository } from "@/data/sql/repositories/Invite.repository";
import { RoleRepository } from "@/data/sql/repositories/Role.repository";
import { RoomRepository } from "@/data/sql/repositories/Room.repository";
import { RoomResidentRepository } from "@/data/sql/repositories/RoomResident.repository";
import { UserRepository } from "@/data/sql/repositories/User.repository";

@Global()
@Module({
    providers: [
        UserRepository,
        RoomRepository,
        InviteCodeRepository,
        RoomResidentRepository,
        AnnouncementRepository,
        AnnouncementCategoryRepository,
        AnnouncementTargetRepository,
        AdminDormitoryRepository,
        RoleRepository,
        BuildingRepository,
        DormitoryRepository,
        AppUnitOfWork,
    ],
    exports: [
        UserRepository,
        RoomRepository,
        InviteCodeRepository,
        RoomResidentRepository,
        AnnouncementRepository,
        AnnouncementCategoryRepository,
        AnnouncementTargetRepository,
        AdminDormitoryRepository,
        RoleRepository,
        BuildingRepository,
        DormitoryRepository,
        AppUnitOfWork,
    ],
})
export class DatabaseModule {}
