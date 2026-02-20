import { BadRequestException, Injectable } from "@nestjs/common";
import { RoleRepository } from "src/data/sql/repositories/Role.repository";
import { UserRepository } from "src/data/sql/repositories/User.repository";
import { CreateUserDto } from "./dto/createUser.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    private userRepo = new UserRepository();
    private roleRepo = new RoleRepository();

    async createUserByAdmin(dto: CreateUserDto) {
        const role = await this.roleRepo.findByName(dto.role);

        if (!role) {
            throw new BadRequestException("Role not found");
        }

        const password_hash = await bcrypt.hash(dto.password, 10);

        return this.userRepo.createUser({
            username: dto.username,
            first_name: dto.first_name,
            last_name: dto.last_name,
            email: dto.email,
            password_hash,
            role_id: role.id,
            status: "ACTIVE",
            created_at: new Date(),
        });
    }

    async listUsers() {
        return this.userRepo.getUsers();
    }

    async updateRole(userId: string, roleName: string) {
        const role = await this.roleRepo.findByName(roleName);
        if (!role) throw new BadRequestException("Role not found");

        await this.userRepo.updateRole(userId, role.id);
    }

    async updateStatus(userId: string, status: string) {
        await this.userRepo.updateStatus(userId, status);
    }
}
