import { IAdminDormitoryRepository } from "@/data/abstactions/repositories/IAdminDormitory.repository";
import { DatabaseRepository } from "../Database.repository";
import { IAdminDormitory } from "@/data/abstactions/entities/IAdminDormitory";
import { Injectable } from "@nestjs/common";
import { AppUnitOfWork } from "../AppUnitOfWork";

@Injectable()
export class AdminDormitoryRepository extends DatabaseRepository implements IAdminDormitoryRepository {
    protected tableName: string = "admin_dormitories";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async create(entities: Partial<IAdminDormitory>): Promise<IAdminDormitory> {
        const [result] = await this.query()(this.tableName).insert(entities);

        return await this.query()(this.tableName).where({ id: result }).first();
    }

    async findByUser(userId: string): Promise<IAdminDormitory> {
        return await this.query()(this.tableName).where({ user_id: userId }).first();
    }

    async findByUserAndDorm(userId: string, dormitoryId: number): Promise<IAdminDormitory> {
        return await this.query()(this.tableName)
            .where({ user_id: userId })
            .andWhere({ dormitory_id: dormitoryId })
            .first();
    }
}
