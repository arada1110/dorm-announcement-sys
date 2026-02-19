import { IUser, IUserWithRole } from "src/data/abstactions/entities/IUser";
import { IUserRepository } from "src/data/abstactions/repositories/IUser.repository";
import { db } from "src/database/Connection";

export class UserRepository implements IUserRepository {
    protected tableName: string = "users";

    async getUsers(): Promise<IUser[]> {
        return db(this.tableName).select("*");
    }

    async createUser(user: Partial<IUser>): Promise<IUser> {
        const [id] = await db(this.tableName).insert(user);
        return db(this.tableName).first();
    }

    async findUserByEmail(email: string): Promise<IUser> {
        return db(this.tableName).where(email).first();
    }

    async findUserByEmailWithRole(email: string): Promise<IUserWithRole> {
        return await db(this.tableName)
            .join("roles", "users.role_id", "roles.id")
            .select("users.*", "roles.name as role_name")
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
}
