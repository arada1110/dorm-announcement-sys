import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { DormitoryController } from "./dormitory.controller";
import { DormitoryService } from "./dormitory.service";
import { DormitoryRepository } from "@/data/sql/repositories/Dormitory.repostory";

@Module({
    imports: [UserModule],
    controllers: [DormitoryController],
    providers: [DormitoryService, DormitoryRepository],
    exports: [DormitoryService],
})
export class DormitoryModule {}
