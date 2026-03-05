import { Module } from "@nestjs/common";
import { InviteController } from "./invite.controller";
import { InviteService } from "./invite.service";
import { UserModule } from "../user/user.module";
import { InviteCodeRepository } from "src/data/sql/repositories/Invite.repository";
import { RoomModule } from "../room/room.module";

@Module({
    imports: [UserModule, RoomModule],
    controllers: [InviteController],
    providers: [InviteService, InviteCodeRepository],
    exports: [InviteService],
})
export class InviteCodeModule {}
