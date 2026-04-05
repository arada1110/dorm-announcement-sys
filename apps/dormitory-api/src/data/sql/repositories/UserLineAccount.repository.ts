import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "../Database.repository";
import { IUserLineAccountRepository } from "@/data/abstactions/repositories/IUserLineAccount.repository";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { IUserLineAccount } from "@/data/abstactions/entities/IUserLineAccount";

@Injectable()
export class UserLineAccountRepository extends DatabaseRepository implements IUserLineAccountRepository {
    protected tableName: string = "user_line_accounts";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async create(entity: IUserLineAccount): Promise<IUserLineAccount> {
        const [id] = await this.query()(this.tableName).insert(entity);

        return this.query()(this.tableName).where({ id }).first();
    }

    async findByLineUserId(lineUserId: string): Promise<IUserLineAccount> {
        return this.query()(this.tableName).where({ line_user_id: lineUserId }).first();
    }

    async findByUserId(userId: string): Promise<IUserLineAccount> {
        return this.query()(this.tableName).where({ user_id: userId }).first();
    }
}
