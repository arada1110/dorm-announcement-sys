import { Module } from "@nestjs/common";
import { InviteCodeModule } from "../invite/invite.module";
import { UserModule } from "../user/user.module";
import { RegistrationService } from "./register.service";
import { RegisterController } from "./register.controller";
import { RoomResidentModule } from "../roomResident/roomResident.module";
import { AppUnitOfWork } from "@/data/sql/AppUnitOfWork";
import { UserRepository } from "@/data/sql/repositories/User.repository";
import { RoomRepository } from "@/data/sql/repositories/Room.repository";
import { InviteCodeRepository } from "@/data/sql/repositories/Invite.repository";
import { RoomResidentRepository } from "@/data/sql/repositories/RoomResident.repository";

@Module({
    imports: [InviteCodeModule, UserModule, RoomResidentModule],
    providers: [
        RegistrationService,
        UserRepository,
        RoomRepository,
        InviteCodeRepository,
        RoomResidentRepository,
        AppUnitOfWork,
    ],
    exports: [RegistrationService],
    controllers: [RegisterController],
})
export class RegistrationModule {}
