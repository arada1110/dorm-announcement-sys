import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/modules/authorization/guards/jwtAuth.guard";
import { AnnouncementTargetService } from "./announcementTarget.service";
import type { AnnouncementTargetDto } from "./dto/announcementTarget.dto";

@UseGuards(JwtAuthGuard)
@Controller("announcement/target")
export class AnnouncementTargetController {
    constructor(private readonly announcementTargetService: AnnouncementTargetService) {}

    @Post()
    create(@Body() dto: AnnouncementTargetDto) {
        return this.announcementTargetService.create(dto);
    }

    @Get(":id")
    getByAnnouncement(announcementId: number) {
        return this.announcementTargetService.getByAnnouncementId(announcementId);
    }

    @Delete(":id")
    delete(@Param("id") id: number) {
        return this.announcementTargetService.deleteByAnnouncementId(id);
    }
}
