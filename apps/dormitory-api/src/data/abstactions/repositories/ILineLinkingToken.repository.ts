import { ILineLinkTokens } from "../entities/ILineLinkToken";

export interface ILineLinkingTokenRepositoy {
    create(data: Partial<ILineLinkTokens>);
    findByToken(token: string);
    deleteByUserId(usrId: string);
    deleteByToken(token: string);
}
