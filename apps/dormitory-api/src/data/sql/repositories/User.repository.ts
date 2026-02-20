import { IUser, IUserWithRole } from "src/data/abstactions/entities/IUser";
import { IUserRepository } from "src/data/abstactions/repositories/IUser.repository";
import { db } from "src/database/Connection";
import { v4 as uuidv4 } from "uuid";

export class UserRepository implements IUserRepository {
    protected tableName: string = "users";

    async getUsers(): Promise<IUser[]> {
        return db(this.tableName).select("*");
    }

    async createUser(user: Partial<IUser>): Promise<IUser> {
        const id = uuidv4();
        await db(this.tableName).insert({ id, ...user });
        return db(this.tableName).where({ id }).first();
    }

    async findUserByEmail(email: string): Promise<IUser> {
        return db(this.tableName).where({ email }).first();
    }

    async findUserByEmailWithRole(email: string): Promise<IUserWithRole> {
        return await db(this.tableName)
            .join("roles", "users.role_id", "roles.id")
            .select("users.*", "roles.role_name as role_name")
            .where("users.email", email)
            .first();
    }

    async findUserById(id: string): Promise<IUser> {
        return await db(this.tableName).where(id).first();
    }

    async updateStatus(id: string, status: string): Promise<void> {
        await db(this.tableName).where({ id }).update({ status });
    }

    async deleteUser(id: string): Promise<void> {
        await db(this.tableName).where(id).delete();
    }

    async updateRole(userId: string, roleId: number) {
        return;
    }
}
