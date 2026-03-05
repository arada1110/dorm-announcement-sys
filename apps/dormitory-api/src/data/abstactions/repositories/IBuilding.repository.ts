import { IBuilding } from "../entities/IBuilding";

export interface IBuildingRepository {
    findBuildingByName(name?: string): Promise<IBuilding>;
}
