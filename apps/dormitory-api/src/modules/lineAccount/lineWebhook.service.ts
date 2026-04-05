import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import axios from "axios";
import { LineAccountService } from "./lineAccount.service";
import { LineLinkingTokenRepository } from "@/data/sql/repositories/LineLinkingToken.repository";
import { LineConfigService } from "../lineConfig/lineConfig.service";
import { decrypt } from "@/utils/encryption.util";

@Injectable()
export class LineWebhookService {
    constructor(
        private readonly lineAccService: LineAccountService,
        private readonly linkingTokenRepo: LineLinkingTokenRepository,
        private readonly lineConfigService: LineConfigService,
    ) {}

    private verifySignature(body: any, signature: string, channelSecret: string) {
        const hash = crypto.createHmac("SHA256", channelSecret).update(JSON.stringify(body)).digest("base64");
        return hash === signature;
    }

    private async replyMessage(replyToken: string, accessToken: string, messages: any[]) {
        await axios.post(
            "https://api.line.me/v2/bot/message/reply",
            { replyToken, messages },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            },
        );
    }

    async handleEvent(body: any, signature: string, dormitoryId: number) {
        const config = await this.lineConfigService.getInternalConfig(dormitoryId);
        if (!config) throw new Error("LINE config not found");

        const channelSecret = decrypt(config.channel_secret);
        const accessToken = decrypt(config.channel_access_token);

        if (!this.verifySignature(body, signature, channelSecret)) {
            throw new Error("Invalid signature");
        }

        for (const event of body.events ?? []) {
            const lineUserId = event.source?.userId;
            if (!lineUserId) continue;

            if (event.type === "follow") {
                await this.replyMessage(event.replyToken, accessToken, [
                    {
                        type: "text",
                        text: "สวัสดีครับ! ยินดีต้อนรับสู่ระบบแจ้งเตือนของหอพัก 🏠\n\nเพื่อรับการแจ้งเตือนประกาศ กรุณาเชื่อมต่อบัญชีของคุณโดย:\n1. กลับไปที่เว็บหอพัก\n2. กดปุ่ม 'รับรหัสเชื่อมต่อ'\n3. นำรหัส 6 หลักมาพิมพ์ในแชทนี้",
                    },
                    {
                        type: "text",
                        text: "หากมีข้อสงสัยสามารถติดต่อแอดมินหอพักได้เลยครับ 😊",
                    },
                ]);
            }

            if (event.type === "message" && event.message?.type === "text") {
                const text = event.message.text.trim();
                await this.handleLinkingToken(text, lineUserId, event.replyToken, accessToken);
            }
        }

        return true;
    }

    private async handleLinkingToken(text: string, lineUserId: string, replyToken: string, accessToken: string) {
        if (!/^\d{6}$/.test(text)) {
            await this.replyMessage(replyToken, accessToken, [
                {
                    type: "text",
                    text: "หากต้องการเชื่อมต่อบัญชี กรุณากลับไปที่เว็บหอพักแล้วกด 'รับรหัสเชื่อมต่อ' แล้วนำรหัส 6 หลักมาพิมพ์ที่นี่",
                },
            ]);
            return;
        }

        const record = await this.linkingTokenRepo.findByToken(text);

        if (!record) {
            await this.replyMessage(replyToken, accessToken, [
                {
                    type: "text",
                    text: "รหัสไม่ถูกต้องหรือหมดอายุแล้ว กรุณากลับไปขอรหัสใหม่ที่เว็บหอพัก",
                },
            ]);
            return;
        }

        await this.lineAccService.bindLineUser(record.user_id, lineUserId);
        await this.linkingTokenRepo.deleteByToken(text);

        await this.replyMessage(replyToken, accessToken, [
            {
                type: "text",
                text: "เชื่อมต่อบัญชีสำเร็จแล้ว ✅\nคุณจะได้รับการแจ้งเตือนประกาศจากหอพักผ่าน LINE นี้ครับ",
            },
        ]);

        console.log(`LINE linked: user ${record.user_id} → ${lineUserId}`);
    }
}
