import { IRole } from "@/data/abstactions/entities/IRole";
import { IRoleRepository } from "@/data/abstactions/repositories/IRole.repository";
import { DatabaseRepository } from "../Database.repository";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoleRepository extends DatabaseRepository implements IRoleRepository {
    protected tablaName: string = "roles";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async list(): Promise<IRole[]> {
        return this.query()(this.tablaName).select("*");
    }

    async findByName(name: string): Promise<{ id: number; name: string }> {
        return this.query()(this.tablaName).where({ role_name: name }).first();
    }

    async createRole(entity: Partial<IRole>): Promise<IRole> {
        const [id] = await this.query()(this.tablaName).insert(entity);
        return this.query()(this.tablaName).where(id).first();
    }

    async deleteRole(id: number): Promise<void> {
        await this.query()(this.tablaName).where(id).delete();
    }
}
