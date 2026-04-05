import { IDormitory } from "@/data/abstactions/entities/IDormitory";
import { IDormitoryRepository } from "@/data/abstactions/repositories/IDormitory.repository";
import { DatabaseRepository } from "../Database.repository";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DormitoryRepository extends DatabaseRepository implements IDormitoryRepository {
    protected tableName: string = "dormitory";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async findDormitoryByName(name: string): Promise<IDormitory> {
        return await this.query()(this.tableName).where({ dormitory_name: name }).first();
    }
}
