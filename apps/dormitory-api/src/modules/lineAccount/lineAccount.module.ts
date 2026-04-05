import { Module } from "@nestjs/common";
import { LineWebhookController } from "./lineWebhook.controller";
import { LineWebhookService } from "./lineWebhook.service";
import { LineAccountService } from "./lineAccount.service";
import { UserLineAccountRepository } from "@/data/sql/repositories/UserLineAccount.repository";
import { LineNotificationService } from "@/modules/lineAccount/lineNotification.service";
import { LineNotificationLogRepository } from "@/data/sql/repositories/LineNotificationLog.repository";
import { AppUnitOfWork } from "@/data/sql/AppUnitOfWork";
import { LineConfigModule } from "../lineConfig/lineConfig.module";
import { LineLinkingTokenRepository } from "@/data/sql/repositories/LineLinkingToken.repository";
import { LineAccountController } from "./lineAccount.controller";

@Module({
    imports: [LineConfigModule],
    controllers: [LineWebhookController, LineAccountController],
    providers: [
        LineWebhookService,
        LineAccountService,
        UserLineAccountRepository,
        LineLinkingTokenRepository,
        LineNotificationService,
        LineNotificationLogRepository,
        AppUnitOfWork,
    ],
    exports: [LineNotificationService],
})
export class LineAccountModule {}
