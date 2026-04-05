import { IDormitory } from "../entities/IDormitory";

export interface IDormitoryRepository {
    findDormitoryByName(name: string): Promise<IDormitory>;
}
