import { IUser, IUserWithRole } from "@/data/abstactions/entities/IUser";
import { IUserRepository } from "@/data/abstactions/repositories/IUser.repository";
import { v4 as uuidv4 } from "uuid";
import { DatabaseRepository } from "../Database.repository";
import { AppUnitOfWork } from "../AppUnitOfWork";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository extends DatabaseRepository implements IUserRepository {
    protected tableName: string = "users";

    constructor(protected readonly uow: AppUnitOfWork) {
        super(uow);
    }

    async getUsers(): Promise<IUser[]> {
        return this.query()(this.tableName).select("*");
    }

    async createUser(user: Partial<IUser>): Promise<IUser> {
        const id = uuidv4();
        await this.query()(this.tableName).insert({ id, ...user });
        return this.query()(this.tableName).where({ id }).first();
    }

    async findUserByEmail(email: string): Promise<IUser> {
        return this.query()(this.tableName).where({ email }).first();
    }

    async findUserByEmailWithRole(email: string): Promise<IUserWithRole> {
        return await this.query()("users as u")
            .leftJoin("roles as r", "u.role_id", "r.id")
            .leftJoin("room_residents as rr", "rr.user_id", "u.id")
            .leftJoin("rooms as rm", "rm.id", "rr.room_id")
            .leftJoin("admin_dormitories as ad", "ad.user_id", "u.id")
            .select(
                "u.*",
                "r.role_name as role_name",
                "rr.room_id as room_id",
                this.query().raw("COALESCE(rm.dormitory_id, ad.dormitory_id) as dormitory_id"),
            )
            .where("u.email", email)
            .first();
    }

    async findUserById(id: string): Promise<IUser> {
        return await this.query()(this.tableName).where({ id }).first();
    }

    async findUserProfileById(id: string) {
        return await this.query()("users as u")
            .leftJoin("roles as r", "u.role_id", "r.id")
            .leftJoin("room_residents as rr", "rr.user_id", "u.id")
            .leftJoin("rooms as rm", "rm.id", "rr.room_id")
            .leftJoin("buildings as b", "b.id", "rm.building_id")
            .leftJoin("admin_dormitories as ad", "ad.user_id", "u.id")
            .select(
                "u.*",
                "r.role_name as role_name",
                "rr.start_date",
                "rr.end_date",
                "rm.id as room_id",
                "rm.room_number",
                "rm.floor",
                "b.building_name",
                this.query().raw("COALESCE(rm.dormitory_id, ad.dormitory_id) as dormitory_id"),
            )
            .where("u.id", id)
            .andWhere((qb) => {
                qb.whereNull("rr.end_date").orWhere("rr.end_date", ">=", this.query().fn.now());
            })
            .orderBy("rr.start_date", "desc")
            .first();
    }

    async updateStatus(id: string, status: string): Promise<void> {
        await this.query()(this.tableName).where({ id }).update({ status });
    }

    async deleteUser(id: string): Promise<void> {
        await this.query()(this.tableName).where({ id }).delete();
    }

    async updateRole(userId: string, roleId: number) {
        return;
    }
}
