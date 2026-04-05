import { IUserLineAccount } from "../entities/IUserLineAccount";

export interface IUserLineAccountRepository {
    create(entity: IUserLineAccount): Promise<IUserLineAccount>;
    findByLineUserId(lineUserId: string): Promise<IUserLineAccount>;
    findByUserId(userId: string): Promise<IUserLineAccount>;
}
