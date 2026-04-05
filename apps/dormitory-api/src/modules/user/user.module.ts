import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRepository } from "@/data/sql/repositories/User.repository";
import { UserController } from "./user.controller";
import { RoleModule } from "../role/role.module";
import { AdminModule } from "../admin/admin.module";
import { AppUnitOfWork } from "@/data/sql/AppUnitOfWork";

@Module({
    imports: [RoleModule, AdminModule],
    controllers: [UserController],
    providers: [UserService, UserRepository, AppUnitOfWork],
    exports: [UserService],
})
export class UserModule {}
