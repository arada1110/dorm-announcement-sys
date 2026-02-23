import { IInvite } from "src/data/abstactions/entities/IInvite";
import { IInviteCodeRepository } from "src/data/abstactions/repositories/IInvite.repository";
import { db } from "src/database/Connection";

export class InviteCodeRepository implements IInviteCodeRepository {
    protected tableName: string = "invitation_codes";

    async list(): Promise<IInvite[]> {
        return db(this.tableName).select("*");
    }

    async findById(id: number): Promise<IInvite> {
        return await db(this.tableName).where({ id: id }).first();
    }

    async findByCode(code: string): Promise<IInvite> {
        return await db(this.tableName).where({ code: code }).first();
    }

    async createInviteCode(data: IInvite): Promise<IInvite> {
        const [id] = await db(this.tableName).insert(data);
        return db(this.tableName).where({ id: id }).first();
    }

    async markAsUsed(id: number): Promise<void> {
        await db(this.tableName).where({ id: id }).update({ is_used: true });
    }

    async deleteInviteCode(id: number): Promise<void> {
        await db(this.tableName).where({ id: id }).delete();
    }
}
