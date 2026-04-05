import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "../Database.repository";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { ILineLinkTokens } from "@/data/abstactions/entities/ILineLinkToken";
import { ILineLinkingTokenRepositoy } from "@/data/abstactions/repositories/ILineLinkingToken.repository";

@Injectable()
export class LineLinkingTokenRepository extends DatabaseRepository implements ILineLinkingTokenRepositoy {
    protected tableName = "line_linking_tokens";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async create(data: Partial<ILineLinkTokens>) {
        await this.query()(this.tableName).insert({
            user_id: data.user_id,
            token: data.token,
            expires_at: data.expires_at,
        });
    }

    async findByToken(token: string) {
        return this.query()(this.tableName).where({ token }).where("expires_at", ">", new Date()).first();
    }

    async deleteByUserId(userId: string) {
        await this.query()(this.tableName).where({ user_id: userId }).delete();
    }

    async deleteByToken(token: string) {
        await this.query()(this.tableName).where({ token }).delete();
    }
}
