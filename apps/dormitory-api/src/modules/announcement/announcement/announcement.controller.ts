import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/authorization/guards/jwtAuth.guard";
import { AnnouncementService } from "./announcement.service";
import { Roles } from "src/modules/authorization/decorators/roles.decorator";
import { CreateAnnouncementDto, UpdateAnnouncementDto } from "../dto/Announcement.dto";
import { RolesGuard } from "src/modules/authorization/guards/roles.guard";
import { Public } from "src/modules/authorization/decorators/public.decorator";

@UseGuards(JwtAuthGuard)
@Controller("announcements")
export class AnnouncementController {
    constructor(private readonly announcementService: AnnouncementService) {}

    @Public()
    @Get()
    listAll() {
        return this.announcementService.listAll();
    }

    @Public()
    @Get(":publicId")
    findOne(@Param("publicId") publicId: string) {
        return this.announcementService.findOne(publicId);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    create(@Body() dto: CreateAnnouncementDto, @Req() req) {
        return this.announcementService.create(dto, req.user);
    }

    @Patch(":publicId")
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    update(@Param("publicId") publicId: string, @Body() dto: UpdateAnnouncementDto) {
        return this.announcementService.update(publicId, dto);
    }

    @Delete(":publicId")
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    delete(@Param("publicId") publicId: string) {
        return this.announcementService.delete(publicId);
    }
}
