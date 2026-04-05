import { IUnitOfWork } from "@/database/IUnitOfWork";
import { IUserRepository } from "./repositories/IUser.repository";
import { IRoomResidentRepository } from "./repositories/IRoomResident.repository";
import { IInviteCodeRepository } from "./repositories/IInvite.repository";
import { IRoomRepository } from "./repositories/IRoom.repository";
import { IAnnouncementRepository } from "./repositories/IAnnouncement.repository";
import { IAnnouncementTargetRepository } from "./repositories/IAnnouncementTarget.repository";

export interface IAppUnitOfWork extends IUnitOfWork {
    readonly userRepository: IUserRepository;
    readonly roomRepository: IRoomRepository;
    readonly inviteRepository: IInviteCodeRepository;
    readonly roomResidentRepository: IRoomResidentRepository;
    readonly announcementRepository: IAnnouncementRepository;
    readonly announcementTargetRepository: IAnnouncementTargetRepository;
}
