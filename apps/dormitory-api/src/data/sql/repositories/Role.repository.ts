import { IRole } from "src/data/abstactions/entities/IRole";
import { IRoleRepository } from "src/data/abstactions/repositories/IRole.repository";
import { db } from "src/database/Connection";

export class RoleRepository implements IRoleRepository {
    protected tablaName: string = "roles";

    async list(): Promise<IRole[]> {
        return db(this.tablaName).select("*");
    }

    async findByName(name: string): Promise<{ id: number; name: string }> {
        return db(this.tablaName).where({ role_name: name }).first();
    }

    async createRole(entity: Partial<IRole>): Promise<IRole> {
        const [id] = await db(this.tablaName).insert(entity);
        return db(this.tablaName).where(id).first();
    }

    async deleteRole(id: number): Promise<void> {
        await db(this.tablaName).where(id).delete();
    }
}
