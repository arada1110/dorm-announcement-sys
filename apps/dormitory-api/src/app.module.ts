import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/authorization/auth.module";
import { UserModule } from "./modules/user/user.module";
import { InviteCodeModule } from "./modules/invite/invite.module";
import { RegistrationModule } from "./modules/register/register.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        UserModule,
        InviteCodeModule,
        RegistrationModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
