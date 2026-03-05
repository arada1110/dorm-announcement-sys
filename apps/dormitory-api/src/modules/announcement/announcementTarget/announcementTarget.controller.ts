import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/authorization/guards/jwtAuth.guard";
import { AnnouncementTargetService } from "./announcementTarget.service";
import { TargetTypes } from "src/data/abstactions/entities/IAnnouncement";

@UseGuards(JwtAuthGuard)
@Controller("announcement/target")
export class AnnouncementTargetController {
    constructor(private readonly announcementTargetService: AnnouncementTargetService) {}

    @Post()
    create(@Body() announcementId: number, target: TargetTypes, roomId?: number, userId?: string) {
        return this.announcementTargetService.create(announcementId, target, roomId, userId);
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
