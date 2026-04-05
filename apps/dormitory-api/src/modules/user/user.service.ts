import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "@/data/sql/repositories/User.repository";
import { CreateDormAdmin, CreateUserDto } from "./dto/createUser.dto";
import * as bcrypt from "bcrypt";
import { RoleService } from "../role/role.service";
import { AppUnitOfWork } from "@/data/sql/AppUnitOfWork";
import { AdminService } from "../admin/admin.service";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly roleService: RoleService,
        private readonly adminService: AdminService,
        private readonly uow: AppUnitOfWork,
    ) {}

    async createUserByAdmin(dto: CreateUserDto, dormitoryId?: number) {
        return this.uow.execute(async () => {
            try {
                const { username, first_name, last_name, email, password, role_name } = dto;
                const existingUser = await this.userRepo.findUserByEmail(email);
                if (existingUser) {
                    throw new BadRequestException("Email already exists");
                }

                const role = await this.roleService.findByName(role_name);
                if (!role) {
                    throw new BadRequestException(role_name + " role not found");
                }

                const password_hash = await bcrypt.hash(password, 10);

                const user = await this.userRepo.createUser({
                    username,
                    email,
                    first_name,
                    last_name,
                    password_hash,
                    role_id: role.id,
                    status: "ACTIVE",
                    created_at: new Date(),
                });

                if (role.name === "ADMIN" && dormitoryId) {
                    await this.adminService.assignAdmin({ userId: user.id, dormitoryId });
                }
                const { password_hash: _, ...safeUser } = user;

                return safeUser;
            } catch (error) {
                throw error;
            }
        });
    }

    async createResident(dto: CreateUserDto) {
        const { username, first_name, last_name, email, password, role_name } = dto;
        const existingUser = await this.userRepo.findUserByEmail(email);
        if (existingUser) {
            throw new BadRequestException("Email already exists");
        }

        const role = await this.roleService.findByName(role_name);
        if (!role) {
            throw new Error(role_name + " role not found");
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
        const role = await this.roleService.findByName(roleName);
        if (!role) throw new BadRequestException("Role not found");

        await this.userRepo.updateRole(userId, role.id);
    }

    async updateStatus(userId: string, status: string) {
        await this.userRepo.updateStatus(userId, status);
    }

    async deleteUser(userId: string) {
        await this.userRepo.deleteUser(userId);
    }

    async findUserByEmail(email: string) {
        return this.userRepo.findUserByEmail(email);
    }

    async findUserById(id: string) {
        return this.userRepo.findUserById(id);
    }

    async findUserByEmailWithRole(email: string) {
        return this.userRepo.findUserByEmailWithRole(email);
    }
}
