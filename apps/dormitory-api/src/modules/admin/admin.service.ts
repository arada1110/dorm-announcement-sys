import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AdminDormitoryRepository } from "@/data/sql/repositories/AdminDormitory.repository";
import { AssignAdminDto } from "./dto/admin.dto";

@Injectable()
export class AdminService {
    constructor(private readonly adminDormRepo: AdminDormitoryRepository) {}

    async assignAdmin(dto: AssignAdminDto) {
        const { userId, dormitoryId } = dto;
        const existing = await this.adminDormRepo.findByUserAndDorm(userId, dormitoryId);

        if (existing) {
            throw new BadRequestException("Admin already assigned");
        }

        return this.adminDormRepo.create({
            user_id: userId,
            dormitory_id: dormitoryId,
        });
    }

    async findByUserAdmin(userId: string) {
        const user = await this.adminDormRepo.findByUser(userId);
        if (!user) {
            throw new NotFoundException("Admin not found");
        }
        return user;
    }
}
