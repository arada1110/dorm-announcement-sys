import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { BuildingController } from "./building.controller";
import { BuildingService } from "./building.service";
import { BuildingRepository } from "@/data/sql/repositories/Building.repository";

@Module({
    imports: [UserModule],
    controllers: [BuildingController],
    providers: [BuildingService, BuildingRepository],
    exports: [BuildingService],
})
export class BuildingModule {}
