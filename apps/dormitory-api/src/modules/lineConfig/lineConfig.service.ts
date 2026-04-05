import { Injectable } from "@nestjs/common";
import { LineOAConfigRepository } from "@/data/sql/repositories/LineOAConfig.repository";
import { randomUUID } from "crypto";
import { encrypt } from "@/utils/encryption.util";
import { CreateLineConfigDto } from "./dto/createLineConfig.dto";
import { UpdateLineConfigDto } from "./dto/updateLineConfig.dto";

@Injectable()
export class LineConfigService {
    constructor(private readonly repo: LineOAConfigRepository) {}

    async getPublicConfig(dormitoryId: number) {
        const config = await this.repo.findActive(dormitoryId);

        if (!config) {
            return {
                enabled: false,
            };
        }

        return {
            lineOaId: config.line_oa_id,
            addFriendUrl: config.add_friend_url,
            liffId: config.liff_id,
            notificationEnabled: config.notification_enabled,
        };
    }

    async getInternalConfig(dormitoryId: number) {
        const config = await this.repo.findActive(dormitoryId);
        return config ?? null;
    }

    async create(dto: CreateLineConfigDto) {
        const existing = await this.repo.findActive(dto.dormitoryId);

        const encryptedAccessToken = encrypt(dto.channelAccessToken);
        const encryptedSecret = encrypt(dto.channelSecret);
        if (existing) {
            throw new Error("LINE config already exists for this dormitory");
        }

        return this.repo.create({
            id: randomUUID(),
            dormitory_id: dto.dormitoryId,
            line_oa_id: dto.lineOaId,
            channel_id: dto.channelId,
            channel_secret: encryptedSecret,
            channel_access_token: encryptedAccessToken,
            add_friend_url: dto.addFriendUrl || "",
            liff_id: dto.liffId || "",
            notification_enabled: dto.notificationEnabled ?? true,
        });
    }

    async updateLineOAConfig(dto: UpdateLineConfigDto) {
        const existing = await this.repo.findActive(dto.dormitoryId);

        if (!existing) {
            throw new Error("LINE config not found");
        }

        const updatePayload: Record<string, any> = {
            dormitory_id: dto.dormitoryId,
            line_oa_id: dto.lineOaId,
            channel_id: dto.channelId,
            add_friend_url: dto.addFriendUrl || "",
            liff_id: dto.liffId || "",
            notification_enabled: dto.notificationEnabled ?? true,
        };

        if (dto.channelSecret) {
            updatePayload.channel_secret = encrypt(dto.channelSecret);
        }
        if (dto.channelAccessToken) {
            updatePayload.channel_access_token = encrypt(dto.channelAccessToken);
        }

        return this.repo.update(existing.id, updatePayload);
    }
}
