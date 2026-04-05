import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "../Database.repository";
import { ILineOAConfigRepository } from "@/data/abstactions/repositories/ILineOAConfig.repository";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { ILineOAConfig } from "@/data/abstactions/entities/ILineOAConfig";

@Injectable()
export class LineOAConfigRepository extends DatabaseRepository implements ILineOAConfigRepository {
    protected tableName: string = "line_oa_configs";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async findActive(dormitoryId: number): Promise<ILineOAConfig> {
        return await this.query()(this.tableName).where({ is_active: true, dormitory_id: dormitoryId }).first();
    }

    async create(data: Partial<ILineOAConfig>): Promise<ILineOAConfig> {
        return await this.query()(this.tableName).insert(data);
    }

    async update(id: string, data: Partial<ILineOAConfig>): Promise<ILineOAConfig> {
        await this.query()(this.tableName).where({ id }).update(data);
        return this.query()(this.tableName).where({ id }).first();
    }
}
