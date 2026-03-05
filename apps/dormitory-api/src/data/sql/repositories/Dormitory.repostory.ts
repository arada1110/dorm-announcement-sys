import { IDormitory } from "src/data/abstactions/entities/IDormitory";
import { IDormitoryRepository } from "src/data/abstactions/repositories/IDormitory.repository";
import { db } from "src/database/Connection";

export class DormitoryRepository implements IDormitoryRepository {
    protected tableName: string = "dormitory";

    async findDormitoryByName(name: string): Promise<IDormitory> {
        return await db(this.tableName).where({ dormitory_name: name }).first();
    }
}
