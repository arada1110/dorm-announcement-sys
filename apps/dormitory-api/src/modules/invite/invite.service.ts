import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { randomBytes } from "crypto";
import { InviteCodeRepository } from "src/data/sql/repositories/Invite.repository";
import { v4 as uuidv4 } from "uuid";
import { RoomService } from "../room/room.service";

@Injectable()
export class InviteService {
    constructor(
        private readonly inviteRepo: InviteCodeRepository,
        private readonly roomServ: RoomService,
    ) {}

    async createInvite(roomNumber: string, expired_at?: Date) {
        const room = await this.roomServ.findRoom(roomNumber);
        if (!room) throw new NotFoundException("Room number not found");

        const code = randomBytes(4).toString("hex").toUpperCase();
        const invite = await this.inviteRepo.createInviteCode({
            public_id: uuidv4(),
            code,
            dormitory_id: room.dormitory_id,
            room_id: room.id,
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
