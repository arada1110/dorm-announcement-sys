import { IAdminDormitory } from "../entities/IAdminDormitory";

export interface IAdminDormitoryRepository {
    create(entities: Partial<IAdminDormitory>): Promise<IAdminDormitory>;
    findByUser(userId: string): Promise<IAdminDormitory>;
    findByUserAndDorm(userId: string, dormitoryId: number): Promise<IAdminDormitory>;
}
