import { ILineOAConfig } from "../entities/ILineOAConfig";

export interface ILineOAConfigRepository {
    findActive(dormitoryId: number): Promise<ILineOAConfig>;
    create(data: Partial<ILineOAConfig>): Promise<ILineOAConfig>;
    update(id: string, data: Partial<ILineOAConfig>): Promise<ILineOAConfig>;
}
