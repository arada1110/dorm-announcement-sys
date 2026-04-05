import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleRepository } from "@/data/sql/repositories/Role.repository";

@Module({
    providers: [RoleService, RoleRepository],
    exports: [RoleService],
})
export class RoleModule {}
