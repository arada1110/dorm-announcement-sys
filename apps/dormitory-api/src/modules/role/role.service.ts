import { Injectable } from "@nestjs/common";
import { IRole } from "@/data/abstactions/entities/IRole";
import { RoleRepository } from "@/data/sql/repositories/Role.repository";

@Injectable()
export class RoleService {
    constructor(private readonly roleRepo: RoleRepository) {}

    async list() {
        return this.roleRepo.list();
    }

    async findByName(name: string) {
        return this.roleRepo.findByName(name);
    }

    async createRole(entities: Partial<IRole>) {
        return this.roleRepo.createRole(entities);
    }

    async deleteRole(id: number) {
        return this.roleRepo.deleteRole(id);
    }
}
