import { Injectable } from "@nestjs/common";
import { BuildingRepository } from "@/data/sql/repositories/Building.repository";

@Injectable()
export class BuildingService {
    constructor(private readonly buildRepo: BuildingRepository) {}

    async findBuilding(name?: string) {
        return this.buildRepo.findBuildingByName(name);
    }

    async getBuilding() {
        return this.buildRepo.listBuilding();
    }
}
