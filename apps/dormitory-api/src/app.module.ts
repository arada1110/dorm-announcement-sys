import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/authorization/auth.module";
import { UserModule } from "./modules/user/user.module";
import { InviteCodeModule } from "./modules/invite/invite.module";
import { RegistrationModule } from "./modules/register/register.module";
import { AnnouncementModule } from "./modules/announcement/announcement.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./modules/authorization/guards/jwtAuth.guard";
import { RoomModule } from "./modules/room/room.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        UserModule,
        InviteCodeModule,
        RegistrationModule,
        AnnouncementModule,
        RoomModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
