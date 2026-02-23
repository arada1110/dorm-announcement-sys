import { Module } from "@nestjs/common";
import { InviteController } from "./invite.controller";
import { InviteService } from "./invite.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [UserModule],
    controllers: [InviteController],
    providers: [InviteService],
    exports: [InviteService],
})
export class InviteCodeModule {}
