import { IInvite } from "../entities/IInvite";

export interface IInviteCodeRepository {
    list(): Promise<IInvite[]>;
    findById(id: number): Promise<IInvite>;
    findByCode(code: string): Promise<IInvite>;
    createInviteCode(data: IInvite): Promise<IInvite>;
    markAsUsed(invitrId: number, userId: string): Promise<void>;
    deleteInviteCode(id: number): Promise<void>;
}
