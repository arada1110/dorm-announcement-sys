import { Controller, Get, Post, Patch, Body, UseGuards, Query, ParseIntPipe } from "@nestjs/common";
import { JwtAuthGuard } from "../authorization/guards/jwtAuth.guard";
import { RolesGuard } from "../authorization/guards/roles.guard";
import { Roles } from "../authorization/decorators/roles.decorator";
import { LineConfigService } from "./lineConfig.service";
import { CreateLineConfigDto } from "./dto/createLineConfig.dto";
import { UpdateLineConfigDto } from "./dto/updateLineConfig.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("admin/line")
export class AdminLineConfigController {
    constructor(private readonly service: LineConfigService) {}

    @Get("config")
    async getConfig(@Query("dormitoryId", ParseIntPipe) dormitoryId: number) {
        return this.service.getInternalConfig(dormitoryId);
    }

    @Post("config")
    async create(@Body() dto: CreateLineConfigDto) {
        return this.service.create(dto);
    }

    @Patch("config")
    async update(@Body() dto: UpdateLineConfigDto) {
        return this.service.updateLineOAConfig(dto);
    }
}
