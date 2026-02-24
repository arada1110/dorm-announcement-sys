import { Injectable, BadRequestException } from "@nestjs/common";
import { randomBytes } from "crypto";
import { InviteCodeRepository } from "src/data/sql/repositories/Invite.repository";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class InviteService {
    private inviteRepo = new InviteCodeRepository();

    async createInvite(room_id: number, expired_at?: Date) {
        const code = randomBytes(4).toString("hex").toUpperCase();

        const invite = await this.inviteRepo.createInviteCode({
            public_id: uuidv4(),
            code,
            room_id,
            is_used: false,
            expired_at: expired_at ?? null,
            created_at: new Date(),
        } as any);

        return invite;
    }

    async validateInvite(code: string) {
        const invite = await this.inviteRepo.findByCode(code);

        if (!invite) {
            throw new BadRequestException("Invalid invite code");
        }

        if (invite.is_used) {
            throw new BadRequestException("Invite already used");
        }

        if (invite.expired_at && invite.expired_at < new Date()) {
            throw new BadRequestException("Invite expired");
        }

        return invite;
    }

    async markInviteAsUsed(id: number) {
        await this.inviteRepo.markAsUsed(id);
    }

    async listInvites() {
        return this.inviteRepo.list();
    }

    async deleteInvite(id: number) {
        await this.inviteRepo.deleteInviteCode(id);
    }
}
