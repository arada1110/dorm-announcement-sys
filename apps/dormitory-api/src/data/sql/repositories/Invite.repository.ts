import { IInvite } from "@/data/abstactions/entities/IInvite";
import { IInviteCodeRepository } from "@/data/abstactions/repositories/IInvite.repository";
import { DatabaseRepository } from "../Database.repository";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InviteCodeRepository extends DatabaseRepository implements IInviteCodeRepository {
    protected tableName: string = "invitation_codes";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async list(): Promise<IInvite[]> {
        return this.query()(this.tableName)
            .leftJoin("rooms", "invitation_codes.room_id", "rooms.id")
            .leftJoin("users", "invitation_codes.used_by_user_id", "users.id")
            .select(
                "invitation_codes.*",
                "rooms.room_number",
                this.query().raw("CONCAT(users.first_name, ' ', users.last_name) as used_by_name"),
            );
    }

    async findById(id: number): Promise<IInvite> {
        return await this.query()(this.tableName).where({ id: id }).first();
    }

    async findByCode(code: string): Promise<IInvite> {
        return await this.query()(this.tableName).where({ code: code }).first();
    }

    async createInviteCode(data: IInvite): Promise<IInvite> {
        const [id] = await this.query()(this.tableName).insert({
            public_id: data.public_id,
            code: data.code,
            dormitory_id: data.dormitory_id,
            room_id: data.room_id,
            is_used: data.is_used,
            expired_at: data.expired_at,
            created_at: data.created_at,
        });

        return this.query()(this.tableName).where({ id }).first();
    }

    async markAsUsed(inviteId: number, userId: string): Promise<void> {
        await this.query()(this.tableName).where({ id: inviteId }).update({ is_used: true, used_by_user_id: userId });
    }

    async deleteInviteCode(id: number): Promise<void> {
        await this.query()(this.tableName).where({ id: id }).delete();
    }
}
