import { IBuilding } from "@/data/abstactions/entities/IBuilding";
import { IBuildingRepository } from "@/data/abstactions/repositories/IBuilding.repository";
import { DatabaseRepository } from "../Database.repository";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BuildingRepository extends DatabaseRepository implements IBuildingRepository {
    protected tableName: string = "buildings";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async findBuildingByName(name?: string): Promise<IBuilding> {
        return await this.query()(this.tableName).where({ building_name: name }).first();
    }

    async listBuilding(): Promise<IBuilding[]> {
        return await this.query()(this.tableName).select("*");
    }
}
