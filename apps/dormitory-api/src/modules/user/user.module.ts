import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRepository } from "src/data/sql/repositories/User.repository";
import { RoleRepository } from "src/data/sql/repositories/Role.repository";
import { UserController } from "./user.controller";

@Module({
    controllers: [UserController],
    providers: [UserService, UserRepository, RoleRepository],
    exports: [UserService],
})
export class UserModule {}
