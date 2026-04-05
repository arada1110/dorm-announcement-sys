import { Module } from "@nestjs/common";
import { LineConfigService } from "./lineConfig.service";
import { LineConfigController } from "./lineConfig.controller";
import { LineOAConfigRepository } from "@/data/sql/repositories/LineOAConfig.repository";
import { AppUnitOfWork } from "@/data/sql/AppUnitOfWork";
import { AdminLineConfigController } from "./adminLineConfig.controller";

@Module({
    controllers: [LineConfigController, AdminLineConfigController],
    providers: [LineConfigService, LineOAConfigRepository, AppUnitOfWork],
    exports: [LineConfigService],
})
export class LineConfigModule {}
