import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from "@nestjs/common";
import { JwtAuthGuard } from "@/modules/authorization/guards/jwtAuth.guard";
import { AnnouncementService } from "./announcement.service";
import { Roles } from "@/modules/authorization/decorators/roles.decorator";
import { CreateAnnouncementDto, UpdateAnnouncementDto } from "../dto/Announcement.dto";
import { RolesGuard } from "@/modules/authorization/guards/roles.guard";
import { Public } from "@/modules/authorization/decorators/public.decorator";

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
    @Get("public")
    getPublicAnnouncements() {
        return this.announcementService.getPublicAnnouncements();
    }

    @Get("resident")
    getResidentAnnouncements(@Req() req) {
        return this.announcementService.getResidentAnnouncements(req.user.id, req.user.roomId);
    }

    @Public()
    @Get("detail/:publicId")
    findOne(@Param("publicId") publicId: string) {
        return this.announcementService.findOne(publicId);
    }

    @Public()
    @Get(":publicId")
    findOneWithAuth(@Param("publicId") publicId: string, @Req() req) {
        const userId = req.user?.id ?? null;
        const roomId = req.user?.roomId ?? null;
        return this.announcementService.findOneWithAuth(publicId, userId, roomId);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    create(@Body() dto: CreateAnnouncementDto) {
        return this.announcementService.create(dto);
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

    @Patch(":publicId/publish")
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    publish(@Param("publicId") publicId: string) {
        return this.announcementService.publish(publicId);
    }

    @Patch(":publicId/unpublish")
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    unpublish(@Param("publicId") publicId: string) {
        return this.announcementService.unpublish(publicId);
    }

    @Post(":publicId/send-line")
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    sendLine(@Param("publicId") publicId: string) {
        return this.announcementService.sendLineNotification(publicId);
    }
}

/* ต้องมี
GET     /announcements
GET     /announcements/public
GET     /announcements/resident
GET     /announcements/category/:category
GET     /announcements/:publicId

POST    /announcements
PATCH   /announcements/:publicId
DELETE  /announcements/:publicId

PATCH   /announcements/:publicId/publish
PATCH   /announcements/:publicId/unpublish

POST    /announcements/:publicId/send-line
*/
