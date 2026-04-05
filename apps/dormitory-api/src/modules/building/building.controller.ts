import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { Roles } from "../authorization/decorators/roles.decorator";
import { JwtAuthGuard } from "../authorization/guards/jwtAuth.guard";
import { RolesGuard } from "../authorization/guards/roles.guard";
import { BuildingService } from "./building.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("buildings")
export class BuildingController {
    constructor(private buildServ: BuildingService) {}

    @Get(":name")
    find(@Param("name") name: string) {
        return this.buildServ.findBuilding(name);
    }

    @Get()
    async getBuilding() {
        return this.buildServ.getBuilding();
    }
}
