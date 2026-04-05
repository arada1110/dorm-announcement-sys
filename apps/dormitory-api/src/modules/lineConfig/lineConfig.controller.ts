import { Controller, Get, Post, Body, Patch, Query } from "@nestjs/common";
import { LineConfigService } from "./lineConfig.service";
import { UpdateLineConfigDto } from "./dto/updateLineConfig.dto";

@Controller("line")
export class LineConfigController {
    constructor(private readonly service: LineConfigService) {}

    @Get("config")
    async getConfig(@Query("dormitoryId") dormitoryId: number) {
        return this.service.getPublicConfig(dormitoryId);
    }

    @Post("config")
    async createConfig(@Body() dto: UpdateLineConfigDto) {
        return this.service.create(dto);
    }

    @Patch("config")
    async updateConfig(@Body() dto: UpdateLineConfigDto) {
        return this.service.updateLineOAConfig(dto);
    }
}
