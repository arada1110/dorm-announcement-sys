import { Injectable } from "@nestjs/common";
import { UserLineAccountRepository } from "@/data/sql/repositories/UserLineAccount.repository";
import { LineLinkingTokenRepository } from "@/data/sql/repositories/LineLinkingToken.repository";
import { ILineLinkTokens } from "@/data/abstactions/entities/ILineLinkToken";

@Injectable()
export class LineAccountService {
    constructor(
        private readonly userLineAccRepo: UserLineAccountRepository,
        private readonly linkingTokenRepo: LineLinkingTokenRepository,
    ) {}

    async generateLinkingToken(userId: string): Promise<string> {
        await this.linkingTokenRepo.deleteByUserId(userId);

        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const data: ILineLinkTokens = {
            user_id: userId,
            token: token,
            expires_at: expiresAt,
        };
        await this.linkingTokenRepo.create(data);

        return token;
    }

    async bindLineUser(userId: string, lineUserId: string) {
        const existing = await this.userLineAccRepo.findByLineUserId(lineUserId);

        if (existing) return existing;

        return this.userLineAccRepo.create({
            user_id: userId,
            line_user_id: lineUserId,
        });
    }

    async getLineAccount(userId: string) {
        return this.userLineAccRepo.findByUserId(userId);
    }
}
