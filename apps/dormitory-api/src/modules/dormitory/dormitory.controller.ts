import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { Roles } from "../authorization/decorators/roles.decorator";
import { JwtAuthGuard } from "../authorization/guards/jwtAuth.guard";
import { RolesGuard } from "../authorization/guards/roles.guard";
import { DormitoryService } from "./dormitory.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("dormitories")
export class DormitoryController {
    constructor(private readonly dormServ: DormitoryService) {}

    @Get(":name")
    find(@Param("name") name: string) {
        return this.dormServ.findDormitory(name);
    }
}
