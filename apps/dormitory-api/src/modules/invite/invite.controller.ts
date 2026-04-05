import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { InviteService } from "./invite.service";
import { JwtAuthGuard } from "../authorization/guards/jwtAuth.guard";
import { RolesGuard } from "../authorization/guards/roles.guard";
import { Roles } from "../authorization/decorators/roles.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("invites")
export class InviteController {
    constructor(private readonly inviteService: InviteService) {}

    @Post()
    create(@Body("room_id") roomId: number) {
        return this.inviteService.createInvite(roomId);
    }

    @Get()
    list(@Req() req) {
        return this.inviteService.listInvites(req.user.dormitoryId);
    }

    @Delete(":id")
    delete(@Param("id") id: number) {
        return this.inviteService.deleteInvite(Number(id));
    }
}
