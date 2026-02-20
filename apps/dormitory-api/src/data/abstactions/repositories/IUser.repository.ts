import { IUser, IUserWithRole } from "../entities/IUser";

export interface IUserRepository {
    getUsers(): Promise<IUser[]>;
    createUser(user: Partial<IUser>): Promise<IUser>;
    findUserByEmail(email: string): Promise<IUser>;
    findUserByEmailWithRole(email: string): Promise<IUserWithRole>;
    findUserById(id: string): Promise<IUser>;
    updateStatus(id: string, status: string): Promise<void>;
    deleteUser(id: string): Promise<void>;
    updateRole(userId: string, roleId: number);
}
