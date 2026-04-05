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
import { DatabaseModule } from "./database/database.module";
import { RoleModule } from "./modules/role/role.module";
import { DormitoryModule } from "./modules/dormitory/dormitory.module";
import { BuildingModule } from "./modules/building/building.module";
import { AnnouncementTargetModule } from "./modules/announcement/announcementTarget/announcementTarget.module";
import { AdminModule } from "./modules/admin/admin.module";
import { LineAccountModule } from "./modules/lineAccount/lineAccount.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { LineNotificationLogModule } from "./modules/lineNotificationLog/lineNotificationLog.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        AuthModule,
        UserModule,
        InviteCodeModule,
        RegistrationModule,
        AnnouncementModule,
        RoomModule,
        RoleModule,
        DormitoryModule,
        BuildingModule,
        AnnouncementTargetModule,
        AdminModule,
        LineAccountModule,
        DashboardModule,
        LineNotificationLogModule,
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
