import { Injectable } from "@nestjs/common";
import axios from "axios";
import { AppUnitOfWork } from "@/data/sql/AppUnitOfWork";
import { LineNotificationLogRepository } from "@/data/sql/repositories/LineNotificationLog.repository";
import { UserLineAccountRepository } from "@/data/sql/repositories/UserLineAccount.repository";
import { LineConfigService } from "../lineConfig/lineConfig.service";
import { decrypt } from "@/utils/encryption.util";

@Injectable()
export class LineNotificationService {
    private readonly url = "https://api.line.me/v2/bot/message/push";

    constructor(
        private readonly repo: UserLineAccountRepository,
        private readonly lineNotiLogRepo: LineNotificationLogRepository,
        private readonly uow: AppUnitOfWork,
        private readonly configService: LineConfigService,
    ) {}

    async sendToUser(announcemntId: number, userId: string, title: string, link: string, dormitoryId: number) {
        try {
            const account = await this.repo.findByUserId(userId);

            if (!account) {
                console.log("User has no LINE linked");
                return;
            }

            const config = await this.configService.getInternalConfig(dormitoryId);

            if (!config.notification_enabled) return;

            const token = decrypt(config.channel_access_token);

            await axios.post(
                this.url,
                {
                    to: account.line_user_id,
                    messages: [
                        {
                            type: "flex",
                            altText: `📢 มีประกาศใหม่\n${title}`,
                            contents: {
                                type: "bubble",
                                hero: {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "text",
                                            text: "📢 ประกาศใหม่",
                                            weight: "bold",
                                            size: "sm",
                                            color: "#ffffff",
                                        },
                                    ],
                                    backgroundColor: "#1e2b4a",
                                    paddingAll: "12px",
                                },
                                body: {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "text",
                                            text: title,
                                            weight: "bold",
                                            size: "md",
                                            wrap: true,
                                            color: "#1f2937",
                                        },
                                    ],
                                    paddingAll: "16px",
                                },
                                footer: {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "button",
                                            action: {
                                                type: "uri",
                                                label: "ดูรายละเอียด",
                                                uri: link,
                                            },
                                            style: "primary",
                                            color: "#1e2b4a",
                                            height: "sm",
                                        },
                                    ],
                                    paddingAll: "12px",
                                },
                            },
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            await this.uow.execute(async () => {
                await this.lineNotiLogRepo.createLog({
                    announcement_id: announcemntId,
                    user_id: userId,
                    status: "SUCCESS",
                    error_message: null,
                });
            });

            console.log("LINE notification sent");
        } catch (error) {
            await this.uow.execute(async () => {
                await this.lineNotiLogRepo.createLog({
                    announcement_id: announcemntId,
                    user_id: userId,
                    status: "FAILED",
                    error_message: error instanceof Error ? error.message : String(error),
                });
            });
        }
    }
}
