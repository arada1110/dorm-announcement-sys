import { BadRequestException, Injectable } from "@nestjs/common";
import { RoleRepository } from "src/data/sql/repositories/Role.repository";
import { UserRepository } from "src/data/sql/repositories/User.repository";
import { CreateUserDto } from "./dto/createUser.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        private userRepo: UserRepository,
        private roleRepo: RoleRepository,
    ) {}

    async createUserByAdmin(dto: CreateUserDto) {
        const { email, username, first_name, last_name, password } = dto;

        const existingUser = await this.userRepo.findUserByEmail(email);
        if (existingUser) {
            throw new BadRequestException("Email already exists");
        }

        const role = await this.roleRepo.findByName("RESIDENT");
        if (!role) {
            throw new Error("RESIDENT role not found");
        }

        const password_hash = await bcrypt.hash(password, 10);

        const createdUser = await this.userRepo.createUser({
            username,
            email,
            first_name,
            last_name,
            password_hash,
            role_id: role.id,
            status: "ACTIVE",
            created_at: new Date(),
        });

        const { password_hash: _, ...safeUser } = createdUser;
        return safeUser;
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
