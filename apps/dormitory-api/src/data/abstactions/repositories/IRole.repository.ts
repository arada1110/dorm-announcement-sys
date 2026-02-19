import { IRole } from "../entities/IRole";

export interface IRoleRepository {
    list(): Promise<IRole[]>;
    findByName(name: string): Promise<{ id: number; name: string }>;
    createRole(entity: Partial<IRole>): Promise<IRole>;
    deleteRole(id: number): Promise<void>;
}
