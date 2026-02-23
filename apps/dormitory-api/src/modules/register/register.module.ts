import { Module } from "@nestjs/common";
import { InviteCodeModule } from "../invite/invite.module";
import { UserModule } from "../user/user.module";
import { RegisterationService } from "./register.service";
import { RegisterController } from "./register.controller";

@Module({
    imports: [InviteCodeModule, UserModule],
    providers: [RegisterationService],
    exports: [RegisterationService],
    controllers: [RegisterController],
})
export class RegistrationModule {}
