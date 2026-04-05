import { Module } from "@nestjs/common";
import { LineNotificationLogController } from "./lineNotificationLog.controller";
import { LineNotificationLogService } from "./lineNotificationLog.service";
import { LineNotificationLogRepository } from "@/data/sql/repositories/LineNotificationLog.repository";
import { AppUnitOfWork } from "@/data/sql/AppUnitOfWork";

@Module({
    controllers: [LineNotificationLogController],
    providers: [LineNotificationLogService, LineNotificationLogRepository, AppUnitOfWork],
    exports: [LineNotificationLogService],
})
export class LineNotificationLogModule {}
