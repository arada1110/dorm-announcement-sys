import { IBuilding } from "src/data/abstactions/entities/IBuilding";
import { IBuildingRepository } from "src/data/abstactions/repositories/IBuilding.repository";
import { db } from "src/database/Connection";

export class BuildingRepository implements IBuildingRepository {
    protected tableName: string = "buildings";

    async findBuildingByName(name?: string): Promise<IBuilding> {
        return await db(this.tableName).where({ building_name: name }).first();
    }
}
